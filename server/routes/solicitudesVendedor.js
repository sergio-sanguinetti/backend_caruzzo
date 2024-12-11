const express = require("express");
const app = express();

const SolicitudesVendedorController = require("../controllers/solicitudesVendedorController/index");

app.get("/api/solicitudes", (req, res) => {
	SolicitudesVendedorController.solicitudes(req, res);
});

app.get("/api/solicitud_vendedor/:id", (req, res) => {
	SolicitudesVendedorController.obtenerSolicitud(req, res);
});
app.get("/api/solicitudes_vendedor/:usuario", (req, res) => {
	SolicitudesVendedorController.obtenerSolicitudesVendedor(req, res);
});

app.post("/api/solicitud-servicio-cliente", (req, res) => {
	SolicitudesVendedorController.registro(req, res);
});

app.put("/api/solicitud-servicio-cliente/:id", (req, res) => {
	SolicitudesVendedorController.actualizacion(req, res);
});
app.put("/api/actualizar-estado-servicio-cliente/:id", (req, res) => {
	SolicitudesVendedorController.actualizacionEstado(req, res);
});

app.delete("/api/solicitud-servicio-cliente/:id", (req, res) => {
	SolicitudesVendedorController.eliminar(req, res);
});

module.exports = app;
