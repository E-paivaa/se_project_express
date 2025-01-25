const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const app = express();
const { PORT = 3001 } = process.env;


mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("CONNECTED!");
  })
  .catch(console.error);


app.use(express.json());

app.use("/", mainRouter);

// app.use((req, res, next) => {
//   req.user = {
//     _id: "67251b4383aac86858c8db57",
//   };
//   next();
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
