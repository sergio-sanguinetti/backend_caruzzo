const express = require("express");
const app = express();

const AuthController = require("../controllers/authController/index");

const upload = require('../middlewares/perfil'); 

app.get("/api/usuario", (req, res) => {
	AuthController.usuario(req, res);
});

app.get("/api/usuarios", (req, res) => {
	AuthController.usuarios(req, res);
});
app.get("/api/vendedores", (req, res) => {
	AuthController.vendedores(req, res);
});

app.get("/api/usuarios/:id", (req, res) => {
	AuthController.obtenerUsuario(req, res);
});

app.post("/api/login", (req, res) => {
	AuthController.login(req, res);
});

app.post("/api/usuario", (req, res) => {
	AuthController.registro(req, res);
});
// Ruta para actualizar el
app.put("/api/usuario/:id", (req, res) => {
	AuthController.actualizacion(req, res);
  });
app.put("/api/actualizar_usuario_admin/:id", (req, res) => {
	AuthController.actualizacionAdmin(req, res);
  });
app.put("/api/validar_vendedor/:id", (req, res) => {
	AuthController.validarVendedor(req, res);
  });

app.delete("/api/usuario/:id", (req, res) => {
	AuthController.eliminar(req, res);
});

module.exports = app;
