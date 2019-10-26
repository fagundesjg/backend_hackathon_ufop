const express = require("express");
const DataController = require("./controllers/DataController");
const api = require("./services/api");

const routes = express.Router();

routes.get("/adhesion", DataController.data);
routes.get("/revenue", DataController.amountPerMonth);
routes.get("/loyalSalesRate", DataController.amountPerMonth);

module.exports = routes;
