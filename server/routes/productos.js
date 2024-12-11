const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer();

const ProductosController = require("../controllers/productosController/index");

app.get("/api/productos/:id", (req, res) => {
	ProductosController.producto(req, res);
});

app.post("/api/producto", (req, res) => {
	ProductosController.registro(req, res);
	
});

app.put("/api/producto/:id", (req, res) => {
	ProductosController.actualizacion(req, res);
});

app.get("/api/productos", (req, res) => {
	ProductosController.productos(req, res);
});

app.post("/api/producto/imagen", upload.single("file"), (req, res) => {
	ProductosController.importarImagen(req, res);
});

app.delete("/api/producto/:id", (req, res) => {
	ProductosController.eliminar(req, res);
});

module.exports = app;
