const express = require("express");
const {
  getLoanController,
  getAPILoanController,
  createLoanController,
  createLoanAPIController: createLoanAPIontroller,
  seedAPIController,
} = require("../controller/loan");

const routes = express.Router();

routes.get("/", getLoanController);
routes.post("/loan", createLoanController);
routes.get("/seed", seedAPIController);
routes.get("/api/loan", getAPILoanController);
routes.post("/api/loan", createLoanAPIontroller);

module.exports = routes;
