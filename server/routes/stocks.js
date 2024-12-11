const express = require("express");
const app = express();

// const multer = require("multer");
// const upload = multer();

const StocksController = require("../controllers/stocksController/index");

// app.get("/api/producto/:id", (req, res) => {
// 	ProductosController.producto(req, res);
// });

app.post("/api/stock", (req, res) => {
	StocksController.registro(req, res);
});

app.get("/api/stocks", (req, res) => {
	StocksController.stocks(req, res);
});

app.delete("/api/stock/:id", (req, res) => {
	StocksController.eliminar(req, res);
});

module.exports = app;
