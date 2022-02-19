const User = require('../models/User')
const Token = require('../models/Token')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
    createTokenPayload,
    sendVerificationEmail,
    sendResetPasswordEmail,
    createHash,
    createJWT,
    createLimitedTimeToken,
    createWalletAddressPayload,
} = require('../utils')
const crypto = require('crypto')
const Web3 = require('web3')
var web3 = new Web3()

const register = async (req, res) => {
    try {
        const { email, username, password, walletAddress, userType2 } = req.body

        if (!email) {
            throw new CustomError.BadRequestError('Please provide an email')
        } else if (!password) {
            throw new CustomError.BadRequestError('Please provide the password')
        }

        var regex = new RegExp(`^${email.trim()}$`, 'ig')
        const emailAlreadyExists = await User.findOne({
            email: { $regex: regex },
        })
        if (emailAlreadyExists) {
            throw new CustomError.BadRequestError('Email already exists')
        }

        if (userType2 === 'true') {
            var regex = new RegExp(`^${walletAddress.trim()}$`, 'ig')
            const user = await User.findOne({ wallets: { $regex: regex } })
            const verificationToken = crypto.randomBytes(40).toString('hex')

            user.email = email
            user.password = password
            user.verificationToken = verificationToken
            await user.save()

            const origin = 'https://marketplace.unicus.one/'
            await sendVerificationEmail({
                name: user.username,
                email: user.email,
                verificationToken: user.verificationToken,
                origin,
            })

            res.status(StatusCodes.CREATED).json({
                msg: 'Success! Please check your email to verify account',
            })

            return null
        }

        if (!username) {
            throw new CustomError.BadRequestError(
                'Please provide the Display Name'
            )
        }

        var regex = new RegExp(`^${username.trim()}$`, 'ig')
        const usernameAlreadyExists = await User.findOne({
            username: { $regex: regex },
        })
        if (usernameAlreadyExists) {
            throw new CustomError.BadRequestError('Display Name already exists')
        }

        let userType = 1,
            wallets = []

        if (walletAddress) {
            var regex = new RegExp(`^${walletAddress.trim()}$`, 'ig')
            const walletAlreadyExists = await User.findOne({
                wallets: { $regex: regex },
            })
            if (walletAlreadyExists && !!walletAddress) {
                throw new CustomError.BadRequestError(
                    'User already exists with this wallet'
                )
            }
            userType = 3
            wallets.push(walletAddress)
        }

        const verificationToken = crypto.randomBytes(40).toString('hex')
        let createObj = {
            username,
            email,
            password,
            userType,
            verificationToken,
            wallets,
            profileUrl: '',
            backgroundUrl: '',
        }

        const user = await User.create(createObj)
        const origin = 'https://marketplace.unicus.one/'

        await sendVerificationEmail({
            name: user.username,
            email: user.email,
            verificationToken: user.verificationToken,
            origin,
        })

        res.status(StatusCodes.CREATED).json({
            msg: 'Success! Please check your email to verify account',
        })
    } catch (e) {
        throw new CustomError.BadRequestError(e.message)
    }
}

const verifyEmail = async (req, res) => {
    try {
        const email = req.query.email
        const verificationToken = req.query.token
        const user = await User.findOne({ email })
        if (!user) {
            throw new CustomError.UnauthenticatedError('Invalid Email')
        }

        if (user.verificationToken === '') {
            throw new CustomError.UnauthenticatedError('User already verified')
        }

        if (user.verificationToken !== verificationToken) {
            throw new CustomError.UnauthenticatedError(
                'Invalid verification token'
            )
        }

        ;(user.isVerified = true), (user.verified = Date.now())
        user.verificationToken = ''

        await user.save()

        res.status(StatusCodes.OK).json({ msg: 'Email Successfully Verified' })
    } catch (e) {
        throw new CustomError.BadRequestError(e.message)
    }

    return res.redirect('https://marketplace.unicus.one/')
}

const login = async (req, res) => {
    try {
        const { email, password, walletAddress } = req.body

        if (walletAddress) {
            var regex = new RegExp(`^${walletAddress.trim()}$`, 'ig')
            const user = await User.findOne({ wallets: { $regex: regex } })

            if (!user.active) {
              throw new CustomError.BadRequestError(
                  'You are not allowed to login! Contact for Support.'
              )
          }

            if (user) {
                if (user.userType === 2 || user.isVerified) {
                    const tokenUser = createWalletAddressPayload(
                        user,
                        walletAddress
                    )
                    // check for existing token
                    const existingToken = await Token.findOne({
                        user: user._id,
                    })

                    if (existingToken) {
                        await Token.findOneAndDelete({ user: user._id })
                    }

                    const token = createJWT({ payload: tokenUser })
                    const userAgent = req.headers['user-agent']
                    const ip = req.ip
                    const userToken = { token, ip, userAgent, user: user._id }

                    await Token.create(userToken)

                    res.status(StatusCodes.OK).json({
                        accessToken: token,
                        user: user,
                    })
                } else {
                    throw new CustomError.BadRequestError(
                        `Please verify your Email Address ${user.email}`
                    )
                }
            } else {
                throw new CustomError.BadRequestError(
                    'Wallet Address Not Registered'
                )
            }
        } else {
            if (!email) {
                throw new CustomError.BadRequestError(
                    'Please provide an email.'
                )
            } else if (!password) {
                throw new CustomError.BadRequestError(
                    'Please enter the password'
                )
            }

            var regex = new RegExp(`^${email.trim()}$`, 'ig')
            const user = await User.findOne({ email: { $regex: regex } })

            if (!user) {
                throw new CustomError.UnauthenticatedError(
                    'Invalid Credentials'
                )
            }

            const isPasswordCorrect = await user.comparePassword(password)

            if (!isPasswordCorrect) {
                throw new CustomError.UnauthenticatedError(
                    'Invalid Credentials'
                )
            }

            if (!user.active) {
                throw new CustomError.BadRequestError(
                    'You are not allowed to login! Contact for Support.'
                )
            }

            if (!user.isVerified) {
                throw new CustomError.UnauthenticatedError(
                    'Please verify your email'
                )
            }

            const tokenUser = createTokenPayload(user)

            // check for existing token
            const existingToken = await Token.findOne({ user: user._id })

            if (existingToken) {
                await Token.findOneAndDelete({ user: user._id })
            }

            const token = createJWT({ payload: tokenUser })
            const userAgent = req.headers['user-agent']
            const ip = req.ip
            const userToken = { token, ip, userAgent, user: user._id }

            await Token.create(userToken)

            res.status(StatusCodes.OK).json({ accessToken: token, user: user })
        }
    } catch (e) {
        throw new CustomError.BadRequestError(e.message)
    }
}

const logout = async (req, res) => {
    try {
        await Token.findOneAndDelete({ user: req.user.userId })
        res.status(StatusCodes.OK).json({ msg: 'User logged out!' })
    } catch (e) {
        throw new CustomError.BadRequestError(e.message)
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            throw new CustomError.BadRequestError('Please provide valid email')
        }

        var regex = new RegExp(`^${email.trim()}$`, 'ig')
        const user = await User.findOne({ email: { $regex: regex } })

        if (user) {
            const passwordToken = crypto.randomBytes(70).toString('hex')
            // send email
            const origin = 'https://marketplace.unicus.one/'
            await sendResetPasswordEmail({
                name: user.username,
                email: user.email,
                token: passwordToken,
                origin,
            })

            const tenMinutes = 1000 * 60 * 10
            const passwordTokenExpirationDate = new Date(
                Date.now() + tenMinutes
            )

            user.passwordToken = createHash(passwordToken)
            user.passwordTokenExpirationDate = passwordTokenExpirationDate
            await user.save()

            res.status(StatusCodes.OK).json({
                msg: 'Please check your email for reset password link',
            })
        } else {
            res.status(StatusCodes.OK).json({ msg: 'Invalid User' })
        }
    } catch (e) {
        throw new CustomError.BadRequestError(e.message)
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, email, password } = req.body
        if (!email) {
            throw new CustomError.BadRequestError('Please provide an email')
        } else if (!password) {
            throw new CustomError.BadRequestError('Please provide the password')
        } else if (!token) {
            throw new CustomError.BadRequestError('Please provide the token')
        }

        var regex = new RegExp(`^${email.trim()}$`, 'ig')
        const user = await User.findOne({ email: { $regex: regex } })

        if (user) {
            const currentDate = new Date()
            if (
                user.passwordToken === createHash(token) &&
                user.passwordTokenExpirationDate > currentDate
            ) {
                user.password = password
                user.passwordToken = null
                user.passwordTokenExpirationDate = null
                await user.save()
                // $2a$10$NI/cqg38P7DhL8cpx50WxuXbmCr78v4yZ8pJButCQt.ZXLoE73HtG
                // $2a$10$NI/cqg38P7DhL8cpx50WxuXbmCr78v4yZ8pJButCQt.ZXLoE73HtG
            }
            res.status(StatusCodes.OK).json({
                msg: 'Password has been successfully updated',
            })
        } else {
            res.status(StatusCodes.OK).json({ msg: 'Invalid User' })
        }
    } catch (e) {
        throw new CustomError.BadRequestError(e.message)
    }
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
}
