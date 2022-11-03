const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const qrcode = require("qrcode");

const Email = require("./email.cjs");
const {
  getAllSignups,
  getSignup,
  sendInvite,
  updateSignup,
} = require("./firebase.cjs");

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

app.get("/register", async (req, res) => {
  const signups = await getAllSignups();
  console.log(signups);

  res.status(200).json({
    results: signups.length,
    status: "success",
    message: "Request sent successfully",
    signups,
  });
});

app.get("/register/:accessId", async (req, res) => {
  const signup = await getSignup(req.params.accessId);
  console.log(signup);

  res.status(200).json({
    status: "success",
    signup,
  });
});

app.get("/generateQRCode", async (req, res) => {
  const signups = await getAllSignups();

  signups.forEach(({ accessID }) => {
    qrcode.toFile(
      `./qrcodes/${accessID}.png`,
      `bigideasconf.com/signin-guest/${accessID}`,
      function (err, data) {
        if (err) console.log(err.message);
      }
    );

    updateSignup(accessID);
  });
});

app.get("/invite", async (req, res) => {
  const signups = await getAllSignups();

  signups.forEach(function (signup, index) {
    setTimeout(function () {
      sendInvite(signup);
    }, index * 20000);
  });
});

module.exports = app;
