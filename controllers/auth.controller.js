const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenPayload,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  createJWT,
  createLimitedTimeToken,
  createWalletAddressPayload,
} = require("../utils");
const crypto = require("crypto");
const Web3 = require("web3");
var web3 = new Web3();

const register = async (req, res) => {
  try {
    const { email, username, password, walletAddress } = req.body;

    if (!email) {
      throw new CustomError.BadRequestError("Please provide an email");
    } else if (!username) {
      throw new CustomError.BadRequestError("Please provide the username");
    } else if (!password) {
      throw new CustomError.BadRequestError("Please provide the password");
    }

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }

    const usernameAlreadyExists = await User.findOne({ username });
    if (usernameAlreadyExists) {
      throw new CustomError.BadRequestError("Username already exists");
    }

    const walletAlreadyExists = await User.findOne({ wallets: walletAddress });
    if (walletAlreadyExists) {
      throw new CustomError.BadRequestError(
        "User already exists with this wallet"
      );
    }

    let userType = 1,
      wallets = [],
      nonce = null;
    if (walletAddress) {
      userType = 2;
      wallets.push(walletAddress);
      const randomString = crypto.randomBytes(10).toString("hex");
      const verifyNonce = await createHash(randomString);
      nonce = verifyNonce;
    }
    const verificationToken = crypto.randomBytes(40).toString("hex");

    let createObj = {
      username,
      email,
      password,
      userType,
      verificationToken,
      wallets,
      nonce,
    };

    const user = await User.create(createObj);
    const origin = "http://localhost:3000";

    await sendVerificationEmail({
      name: user.username,
      email: user.email,
      verificationToken: user.verificationToken,
      origin,
    });

    res.status(StatusCodes.CREATED).json({
      msg: "Success! Please check your email to verify account",
    });
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError.UnauthenticatedError("Invalid Email");
    }

    if (user.verificationToken === "") {
      throw new CustomError.UnauthenticatedError("User already verified");
    }

    if (user.verificationToken !== verificationToken) {
      throw new CustomError.UnauthenticatedError("Invalid verification token");
    }

    (user.isVerified = true), (user.verified = Date.now());
    user.verificationToken = "";

    await user.save();

    res.status(StatusCodes.OK).json({ msg: "Email Successfully Verified" });
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, walletAddress, signature } = req.body;

    if (walletAddress && !email && !password) {
      if (signature) {
        const user = await User.findOne({ wallets: walletAddress });
        const signatureAddress = await web3.eth.accounts.recover(
          user.nonce,
          signature
        );
        if (walletAddress === signatureAddress) {
          const tokenUser = createWalletAddressPayload(user, walletAddress);

          // check for existing token
          const existingToken = await Token.findOne({ user: user._id });

          if (existingToken) {
            await Token.findOneAndDelete({ user: user._id });
          }

          const token = createJWT({ payload: tokenUser });
          const userAgent = req.headers["user-agent"];
          const ip = req.ip;
          const userToken = { token, ip, userAgent, user: user._id };

          await Token.create(userToken);

          res.status(StatusCodes.OK).json({ accessToken: token });
        } else {
          throw new CustomError.BadRequestError(
            "Invalid Signature. Please try again..!"
          );
        }
      } else {
        throw new CustomError.BadRequestError("Please provide the signature.");
      }
    } else {
      if (!email) {
        throw new CustomError.BadRequestError("Please provide an email.");
      } else if (!password) {
        throw new CustomError.BadRequestError("Please enter the password");
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
      }

      const isPasswordCorrect = await user.comparePassword(password);

      if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
      }

      if (!user.isVerified) {
        throw new CustomError.UnauthenticatedError("Please verify your email");
      }

      const tokenUser = createTokenPayload(user);

      // check for existing token
      const existingToken = await Token.findOne({ user: user._id });

      if (existingToken) {
        await Token.findOneAndDelete({ user: user._id });
      }

      const token = createJWT({ payload: tokenUser });
      const userAgent = req.headers["user-agent"];
      const ip = req.ip;
      const userToken = { token, ip, userAgent, user: user._id };

      await Token.create(userToken);

      res.status(StatusCodes.OK).json({ accessToken: token });
    }
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

const logout = async (req, res) => {
  try {
    await Token.findOneAndDelete({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ msg: "User logged out!" });
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new CustomError.BadRequestError("Please provide valid email");
    }

    const user = await User.findOne({ email });

    if (user) {
      const passwordToken = crypto.randomBytes(70).toString("hex");
      // send email
      const origin = "http://localhost:3000";
      await sendResetPasswordEmail({
        name: user.username,
        email: user.email,
        token: passwordToken,
        origin,
      });

      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

      user.passwordToken = createHash(passwordToken);
      user.passwordTokenExpirationDate = passwordTokenExpirationDate;
      await user.save();

      res
        .status(StatusCodes.OK)
        .json({ msg: "Please check your email for reset password link" });
    } else {
      res.status(StatusCodes.OK).json({ msg: "Invalid User" });
    }
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    if (!email) {
      throw new CustomError.BadRequestError("Please provide an email");
    } else if (!password) {
      throw new CustomError.BadRequestError("Please provide the password");
    } else if (!token) {
      throw new CustomError.BadRequestError("Please provide the token");
    }

    const user = await User.findOne({ email });

    if (user) {
      const currentDate = new Date();

      if (
        user.passwordToken === createHash(token) &&
        user.passwordTokenExpirationDate > currentDate
      ) {
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();
      }

      res
        .status(StatusCodes.OK)
        .json({ msg: "Password has been successfully updated" });
    } else {
      res.status(StatusCodes.OK).json({ msg: "Invalid User" });
    }
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
