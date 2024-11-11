const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const travelRouter = require("./routes/Travelrouter");
const userRouter = require("./routes/Userrouter");
const globalErrorHanlder = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const app = express();

app.use(helmet());
if ((process.env.NODE_ENV = "developement")) {
  app.use(morgan("dev"));
}

app.use(express.json());

// middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price"
    ],
  })
);

//data sanitization  against noseql query injection

app.use(mongoSanitize());

// data sanitization from xss

app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// Routes
app.use("/api/v1/travels", travelRouter);
app.use("/api/v1/users", userRouter);
app.all("*", (req, res, next) => {
  //   res.status(404).json({
  //     status: "fail",
  //     message: `Can't find ${req.originalUrl} on this site`,
  //   });
  // next()

  //   const err = new Error(`Can't find ${req.originalUrl} on this site`);
  //   err.status = "fail";
  //   err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this site`, 404));
  //   });)
});

app.use(globalErrorHanlder);

module.exports = app;
