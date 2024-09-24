const dotenv = require("dotenv");
const morgan =require("morgan")
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const travelRouter = require("./routes/Travelrouter");
app.use(morgan('dev'))
app.use(express.json());
app.use("/api/v1/travels", travelRouter);

const PORT = process.env.PORT || 3000;
dotenv.config({ path: "./config.env" });


console.log("----------");
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log("DB conneciton success"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("The app is running on port", PORT);
});
