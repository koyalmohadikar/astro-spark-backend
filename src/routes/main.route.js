const userRoutes = require("./user.route");

const routes = require("express").Router();

routes.use("/user", userRoutes);

module.exports = routes;