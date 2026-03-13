const express = require("express");
const { dbConnect } = require("./config/db");
const app = express();
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
