const express = require("express");
const authRoutes = require("./routes/authRoutes");
const resumesRoutes = require("./routes/resumesRoutes");
const connectWithDB = require("./config/mongodbConfig");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

const corsOptions = {
  credentials: true,
  // origin: "http://localhost:3000",
  origin: "https://jobfit-analyzer.onrender.com",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// alow access to the client
app.use((req, res, next) => {
  // Allow sending cookies
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Authentication routes
app.use("/api/v1", authRoutes);

// Resume routes
app.use("/api/v1/resumes", resumesRoutes);

// Connect with database and start the server
connectWithDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => {
    console.log(error);
  });
