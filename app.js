require("dotenv").config();
require("./config/db");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8001;
const router = require("./router/index");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({
    secret: process.env.Secret,
    saveUninitialized: true,
    resave: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
);

app.use("/", router);

app.listen(PORT, () => {
  console.log("server runing on port:" + PORT);
});
