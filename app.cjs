const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const Email = require("./email.cjs");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.static(path.join(`${__dirname}/public`)));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.post("/register", (req, res) => {
  const signup = {
    ...req.body,
  };

  new Email(signup).sendRegistration();

  console.log(signup);

  res.status(200).json({
    status: "success",
    message: "Request sent successfully",
    signup,
  });
});

module.exports = app;
