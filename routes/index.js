const express = require("express");
const {
  getLoanController,
  getAPILoanController,
  createLoanController,
  createLoanAPIontroller,
} = require("../controller/loan");

const routes = express.Router();

routes.get("/loan", getLoanController);
routes.post("/loan", createLoanController);
routes.get("/api/loan", getAPILoanController);
routes.post("/api/loan", createLoanAPIontroller);

module.exports = routes;
