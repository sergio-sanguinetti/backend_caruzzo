const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');

const VehiculosController = require("../controllers/vehiculosController/index");

app.get("/api/vehiculos", (req, res) => {
	VehiculosController.vehiculos(req, res);
});
app.get("/api/vehiculos_aleatorios", (req, res) => {
	VehiculosController.vehiculosAleatorios(req, res);
});

app.get("/api/vehiculos/:id", (req, res) => {
	VehiculosController.obtenerVehiculo(req, res);
});
app.get("/api/vehiculos_vendedor/:usuario", (req, res) => {
	VehiculosController.obtenerVehiculosVendedor(req, res);
});

app.post("/api/vehiculo", (req, res) => {
	VehiculosController.registro(req, res);
});

app.put("/api/vehiculo/:id", (req, res) => {
	VehiculosController.actualizacion(req, res);
});
app.put("/api/estado_vehiculo/:id", (req, res) => {
	VehiculosController.actualizacionEstado(req, res);
});

app.delete("/api/vehiculo/:id", (req, res) => {
	VehiculosController.eliminar(req, res);
});

const directorioImagenes = path.join(__dirname, '../../src/imagenes_vehiculo');

app.use('/imagenes_vehiculo', express.static(directorioImagenes));

app.get('/api/mostrar_imagen/:id/:ruta', (req, res) => {
  
	const idImagen = req.params.id;
	const rutaImagen = req.params.ruta;
	// Ruta relativa de la imagen dentro del directorio de imágenes
	// Enviar la etiqueta de imagen con la ruta src
	res.send(`<img src="/imagenes_vehiculo/${idImagen}/${rutaImagen}" alt="Imagen">`);
  });


module.exports = app;
