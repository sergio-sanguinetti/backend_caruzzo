const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer();

// const upload = multer({ dest: '../../../src/imagenes-gastos/' });
const GastosController = require("../controllers/gastosController/index");

app.get("/api/gastos/:id", (req, res) => {
	GastosController.gasto(req, res);
});

app.post("/api/gasto", (req, res) => {
	GastosController.registro(req, res);
	
});

app.put("/api/gasto/:id", (req, res) => {
	GastosController.actualizacion(req, res);
});

app.get("/api/gastos", (req, res) => {
	GastosController.gastos(req, res);
});

app.post("/api/gasto/imagen", upload.single("file"), (req, res) => {
	GastosController.importarImagen(req, res);
});

app.get("/api/gasto/:imagen", (req, res) => {
	

	const nombreArchivo = req.params.imagen;
	const rutaArchivo = 'src/imagenes-gastos/' + nombreArchivo;
	// console.log(nombreArchivo);
	// Envía el archivo como respuesta
	res.sendFile(rutaArchivo);
});

app.delete("/api/gasto/:id", (req, res) => {
	GastosController.eliminar(req, res);
});

module.exports = app;
