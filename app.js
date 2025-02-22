require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const { errors } = require('celebrate');
// const { requestLogger, errorLogger } = require('./middlewares/logger');

const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;


mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());
app.use("/", mainRouter);

// our routes
// app.use(requestLogger);
// app.use(errorLogger);
// // celebrate error handler
// app.use(errors());
// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
