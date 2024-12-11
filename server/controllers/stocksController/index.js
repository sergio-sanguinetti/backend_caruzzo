const StockModel = require("../../models/stock/index");

const mongoose = require("mongoose");

// const fs = require("fs");
// const path = require("path");

// const { limpiarUrl } = require("../../utils/url");

class StocksController {
  constructor() { }

  registro = async (req, res) => {
    const body = req.body;
    const id = new mongoose.Types.ObjectId();

    const data = new StockModel({
      _id: id.toString(),
      cantidad: body.cantidad,
      almacen: body.almacen,
      variante: body.variante,
      producto: body.producto
    });

    try {
      await data.save();

      return res.json({
        ok: true
      })
    } catch (error) {
      console.log(error)
    }
  }

  stocks = async (req, res) => {
		let find = {};
    const query = req.query;

    // if(req.usuario.rol === "EMPRESA"){
    //   find = { ...find, empresa: req.usuario.id };
    // }

    if(req.usuario.rol === "ADMIN" && query.empresa){
      find = { ...find, empresa: query.empresa };
    }

    if(query.producto) {
      find = { ...find, producto: query.producto };
    }

    if(query.almacen) {
      find = { ...find, almacen: query.almacen };
    }

		const stocks = await StockModel.find(find).populate(["variante", "almacen"]);

		return res.json({
			ok: true,
			stocks,
		});
	};

  eliminar = async (req, res) => {
    const id = req.params.id;

		try {
			await StockModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}

module.exports = new StocksController();