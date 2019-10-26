const express = require("express");

const api = require("./services/api");

const routes = express.Router();

routes.get("/", async (req, res) => {
  const { data } = await api.get();
  return res.json(data);
});

module.exports = routes;
