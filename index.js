require("dotenv").config();
var express = require("express");
const body_parser = require("body-parser");
const routes = require("./routes");
require("./config/db");

var app = express();

app.use(body_parser.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use("/", routes);

app.set("view engine", "eta");
app.set("views", "./views");

const port = process.env.PORT || 8000;

var server = app.listen(port, function (e) {
  if (e) {
    console.log("Loan App Application failed to start due to ", e.message);
    return;
  }
  var host = server.address().address;
  var port = server.address().port;
  console.log("Loan App listening at http://%s:%s", host, port);
});

exports.app = app;
