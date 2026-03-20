require("dotenv").config();
const { dbConnect } = require("./config/db");
const app = require("./index");
const port = process.env.PORT || 3000;
dbConnect();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
