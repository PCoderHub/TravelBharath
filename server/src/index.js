const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json({ message: "Invalid JSON format - check request body" });
  }
  next(err);
});
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);

app.use(errorHandler);

module.exports = app;
