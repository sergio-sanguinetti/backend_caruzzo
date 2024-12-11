const LoteModel = require("../../models/lote/index");

const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const { SEED } = require("../../config/env");

class LotesController {
  constructor() { }

  registro = async (req, res) => {
    const body = req.body;
    const id = new mongoose.Types.ObjectId();

    const data = new LoteModel({
      _id: id.toString(),
      usuario: body.usuario,
      nombre_lote: body.nombre_lote,
      nro_vehiculos: body.nro_vehiculos,
      direccion: body.direccion,
      url: body.url,
      telefono: body.telefono,
      tipo: body.tipo,
      estado: body.estado,
     })

    try {
      await data.save();

      return res.json({
        ok: true
      })
    } catch (error) {
      console.log(error)
    }
  }

  actualizacion = async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    let data = {
      nombre_lote: body.nombre_lote,
      nro_vehiculos: body.nro_vehiculos,
      direccion: body.direccion,
      url: body.url,
      telefono: body.telefono,
      tipo: body.tipo,
      estado: body.estado,
    }

    try {
      await LoteModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }

    res.json({ ok: true });
  }

  obtenerLote = async (req, res) => {
    
    const id = req.params.id;

    const lotesBD = await LoteModel.findById(id);

    res.json({ ok: true, lote: lotesBD });

  }

  obtenerLotesVendedor = async (req, res) => {
    
    const usuario = req.params.usuario;
    try {

      const lotesBD = await LoteModel.find({ usuario });
  
      if (!lotesBD || lotesBD.length === 0) {
        return res.status(404).json({
          ok: false,
          message: 'No se encontraron lotes para este usuario',
        });
      }
  
      return res.json({
        ok: true,
        lotes: lotesBD,
      });
    } catch (error) {
      console.error('Error al obtener los lotes:', error);
      return res.status(500).json({
        ok: false,
        message: 'Error al buscar los lotes',
      });
    }
    
  };
  

  vehiculos = async (req, res) => {
		let find = {};
    const query = req.query;

		// if(req.usuario.rol === "EMPRESA"){
    //   find = { ...find, empresa: req.usuario.id };
    // }

    // if(req.usuario.rol === "ADMIN" && query.empresa){
    //   find = { ...find, empresa: query.empresa };
    // }

		const vehiculos = await LoteModel.find({});

		return res.json({
			ok: true,
			vehiculos,
		});
	};

  eliminar = async (req, res) => {
    const id = req.params.id;

		try {
			await LoteModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}

module.exports = new LotesController();
