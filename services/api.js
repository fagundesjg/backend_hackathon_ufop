const axios = require("axios");

const api = axios.create({
  baseURL: "https://hackaengine-dot-red-equinox-253000.appspot.com/sales"
});

module.exports = api;
