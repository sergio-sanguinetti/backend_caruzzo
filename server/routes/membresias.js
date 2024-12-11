const express = require("express");
const app = express();

const MembresiasController = require("../controllers/membresiasController/index");

app.post("/api/membresia/:vendedor", (req, res) => {
	MembresiasController.registro(req, res);
});
app.get("/api/success/:session_id/:membresia_caruzzo/:meses_caruzzo/:vendedor", (req, res) => {
	MembresiasController.success(req, res);
});

module.exports = app;
