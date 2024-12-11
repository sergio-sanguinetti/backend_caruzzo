const express = require("express");
const app = express();

const SolicitudesAutosController = require("../controllers/solicitudesAutosController/index");

app.get("/api/solicitudes_autos", (req, res) => {
	SolicitudesAutosController.solicitudes(req, res);
});

app.get("/api/solicitud_auto_vendedor/:id", (req, res) => {
	SolicitudesAutosController.obtenerSolicitud(req, res);
});
// app.get("/api/solicitudes_vendedor/:usuario", (req, res) => {
// 	SolicitudesAutosController.obtenerSolicitudesVendedor(req, res);
// });

app.post("/api/solicitud-auto-cliente", (req, res) => {
	SolicitudesAutosController.registro(req, res);
});

app.put("/api/solicitud-auto-cliente/:id", (req, res) => {
	SolicitudesAutosController.actualizacion(req, res);
});
app.put("/api/estado_solicitud_vehiculo/:id", (req, res) => {
	SolicitudesAutosController.actualizacionEstadoSolicitud(req, res);
});

app.delete("/api/solicitud-auto-cliente/:id", (req, res) => {
	SolicitudesAutosController.eliminar(req, res);
});

module.exports = app;
