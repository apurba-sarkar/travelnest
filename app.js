const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const travelRouter = require("./routes/Travelrouter");
const userRouter = require("./routes/Userrouter");
const globalErrorHanlder = require("./controllers/errorController");
const app = express();

if ((process.env.NODE_ENV = "developement")) {
  app.use(morgan("dev"));
}

app.use(express.json());

// middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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
