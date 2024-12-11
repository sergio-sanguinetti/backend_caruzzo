const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer();

// const upload = multer({ dest: '../../../src/imagenes-servicios/' });
const ServiciosController = require("../controllers/serviciosController/index");

app.get("/api/servicios/:id", (req, res) => {
	ServiciosController.servicio(req, res);
});

app.post("/api/servicio", (req, res) => {
	ServiciosController.registro(req, res);
	
});

app.put("/api/servicio/:id", (req, res) => {
	ServiciosController.actualizacion(req, res);
});

app.get("/api/servicios", (req, res) => {
	ServiciosController.servicios(req, res);
});

app.post("/api/servicio/imagen", upload.single("file"), (req, res) => {
	ServiciosController.importarImagen(req, res);
});

app.get("/api/servicio/:imagen", (req, res) => {
	

	const nombreArchivo = req.params.imagen;
	const rutaArchivo = 'src/imagenes-servicios/' + nombreArchivo;
	// console.log(nombreArchivo);
	// Envía el archivo como respuesta
	res.sendFile(rutaArchivo);
});

app.delete("/api/servicio/:id", (req, res) => {
	ServiciosController.eliminar(req, res);
});

module.exports = app;
