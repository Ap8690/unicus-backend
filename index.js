require("dotenv").config();
require("express-async-errors");
const bodyParser = require("body-parser");
// express
const express = require("express");
const app = express();
// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// database
const connectDB = require("./db/connect");

//  routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const nftRouter = require("./routes/nftRoutes");
const auctionRouter = require("./routes/auctionRoute");
const adminRouter = require("./routes/adminRoutes");
const generalRouter = require("./routes/settings/myStore/generalRoutes");
const advanceRouter = require("./routes/settings/myStore/advanceRoutes");
const analyticsRouter = require("./routes/settings/myStore/analyticsRoutes");
const appearanceRouter = require("./routes/settings/myStore/appearanceRoutes");
const seoRouter = require("./routes/settings/myStore/seoRoutes");

const storefrontRouter = require("./routes/storefrontRoutes");
const myAccountRouter = require("./routes/settings/myAccount/myAccountRoutes")

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const domainParser = require("./middleware/domain-parser")

app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15000 * 60 * 1000,
//     max: 60,
//   })
// );
app.use(morgan("dev"));
app.use(helmet());
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(domainParser);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/nft", nftRouter);
app.use("/auction", auctionRouter);
app.use("/admin", adminRouter);
app.use("/store", storefrontRouter);
//Storefront
app.use("/general", generalRouter);
app.use("/advance", advanceRouter);
app.use("/analytics", analyticsRouter);
app.use("/appearance", appearanceRouter);
app.use("/seo", seoRouter);
app.use("/my-account", myAccountRouter);



//Storefront

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;
let DB_URL=""
if(process.env.NODE_ENV === "prod"){
  DB_URL = process.env.MONGO_URL
}else if(process.env.NODE_ENV === "staging"){
  DB_URL = process.env.MONGO_URL_QA;
}
else if(process.env.NODE_ENV === "demo"){
  DB_URL = process.env.MONGO_URL_DEMO;
}
else{
    DB_URL = process.env.MONGO_URL_QA;
}

const start = async () => {

  try {
    console.log(DB_URL, process.env.NODE_ENV);
    await connectDB(DB_URL);
    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`Server is up and running on ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
