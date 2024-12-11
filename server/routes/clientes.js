const express = require("express");
const app = express();

const AuthController = require("../controllers/clientesController/index");

app.get("/api/clientes", (req, res) => {
	AuthController.clientes(req, res);
});

app.get("/api/clientes/:id", (req, res) => {
	AuthController.obtenerUsuario(req, res);
});

app.post("/api/cliente", (req, res) => {
	AuthController.registro(req, res);
});

app.put("/api/cliente/:id", (req, res) => {
	AuthController.actualizacion(req, res);
});

app.delete("/api/cliente/:id", (req, res) => {
	AuthController.eliminar(req, res);
});

module.exports = app;
