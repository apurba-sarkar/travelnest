const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

process.on("uncaughtException",err=>{
  // console.log(err)
  console.log("uncaughtException! Shutting Down...");
    process.exit(1);
})

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;

console.log("----------");
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log("DB connection success"))
  .catch((err) => console.log((err) => console.log(err)));

  const server=app.listen(PORT, () => {
    console.log("The app is running on port", PORT);
  });
  // console.log(x)

process.on("unhandledRejection", (err) => {
  // console.log(err);
  console.log("unhandledRejection! Shutting Down...");
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x)
