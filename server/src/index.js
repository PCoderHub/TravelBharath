require("dotenv").config();
const express = require("express");
const { dbConnect } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const userRoutes = require("./routes/userRoutes");

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
