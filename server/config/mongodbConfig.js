const mongoose = require("mongoose");
require("dotenv").config();

// Connect with database
const connectWithDB = async () => {
  try {
    if (await mongoose.connect(process.env.MONGODB_URI)) {
      console.log("Connected with Database!!!");
    }
  } catch (error) {
    console.log("*** Database Connection FAILED ***");
    console.log("ERROR MESSAGE: " + error.message);
    process.exit(1);
  }
};

module.exports = connectWithDB;
