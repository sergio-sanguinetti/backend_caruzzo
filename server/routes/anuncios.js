const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer();

const AnunciosController = require("../controllers/anunciosController/index");

app.get("/api/anuncios", (req, res) => {
	AnunciosController.anuncios(req, res);
});

app.post("/api/anuncio", upload.single("file"), (req, res) => {
	AnunciosController.registro(req, res);
});

app.delete("/api/anuncio/:id", (req, res) => {
	AnunciosController.eliminar(req, res);
});

module.exports = app;