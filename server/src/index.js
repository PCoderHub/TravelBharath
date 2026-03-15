const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);

app.use(errorHandler);

module.exports = app;
