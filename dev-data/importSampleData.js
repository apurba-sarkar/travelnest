const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Travel = require("../models/travelModel");


dotenv.config({ path: "./config.env" });


const result = dotenv.config({ path: "./config.env" });

if (result.error) {
  console.log("Error loading .env file:", result.error);
} else {
  console.log("Environment variables loaded:", result.parsed);
}

console.log(process.env.DATABASE_PASSWORD);

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log("DB conneciton success"))
  .catch((err) => console.log(err, "Database string error"));

const travels = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
);

const importData = async () => {
  try {
    await Travel.create(travels);
    console.log("Data suucesfully inserted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Travel.deleteMany();
    console.log("Data suucesfully deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}
// console.log(process.argv);
