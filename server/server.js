const express = require("express");
const authRoutes = require("./routes/authRoutes");
const resumesRoutes = require("./routes/resumesRoutes");
const connectWithDB = require("./config/mongodbConfig");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Connect with database
connectWithDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

// Authentication routes
app.use("/api/v1", authRoutes);

// Resume routes
app.use("/api/v1/resumes", resumesRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
