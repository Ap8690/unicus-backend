
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
const storefrontRouter = require("./routes/storefrontRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const domainParser = require("./middleware/domain-parser")

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(morgan("dev"));
app.use(helmet());
const corsOptions = {
  origin: "https://unicus.one/",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors());
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
app.use("/create-store", storefrontRouter);
//Storefront
app.use("/general", generalRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;
const DB_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/task-manager-api";
const start = async () => {
  try {
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
