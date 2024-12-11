const express = require("express");

const app = express();

const path = require("path");

/***************************/
/*----- MIDDLEWARES -------*/
/***************************/
const { verificaToken } = require("../middlewares/auth");

// app.use(verificaToken);

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "public, no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

/***************************/
/*--------- ROUTES --------*/
/***************************/

app.use(require("./auth"));
app.use(require("./vehiculos"));
app.use(require("./lotes"));
app.use(require("./solicitudesVendedor"));
app.use(require("./solicitudesAutos"));
app.use(require("./reportes"));
app.use(require("./membresias"));

module.exports = app;
