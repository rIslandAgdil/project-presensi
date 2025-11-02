const express = require("express");
const route = express.Router();
const login = require("./authController");

route.post("/", login);

module.exports = route;
