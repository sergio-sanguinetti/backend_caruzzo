const UsuarioModel = require("../../models/cliente/index");

const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const { SEED } = require("../../config/env");

class AuthController {
  constructor() { }

  registro = async (req, res) => {
    const body = req.body;
    const id = new mongoose.Types.ObjectId();

    const data = new UsuarioModel({
      _id: id.toString(),
      nombre: body.nombre,
      documento: body.documento,
      correo: body.correo,
      tipo: body.tipo,
      id_fiscal: body.id_fiscal,
      razon_social: body.razon_social,
      telefono: body.telefono,
      telefono2: body.telefono2,
      observaciones: body.observaciones,
      empresa: req.usuario.id
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
      nombre: body.nombre,
      documento: body.documento,
      correo: body.correo,
      tipo: body.tipo,
      id_fiscal: body.id_fiscal,
      razon_social: body.razon_social,
      telefono: body.telefono,
      telefono2: body.telefono2,
      observaciones: body.observaciones
    }

    try {
      await UsuarioModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }

    res.json({ ok: true });
  }

  obtenerUsuario = async (req, res) => {
    const id = req.params.id;

    const usuarioBD = await UsuarioModel.findById(id);

    res.json({ ok: true, usuario: usuarioBD });
  }

  clientes = async (req, res) => {
		let find = {};
    const query = req.query;

		if(req.usuario.rol === "EMPRESA"){
      find = { ...find, empresa: req.usuario.id };
    }

    if(req.usuario.rol === "ADMIN" && query.empresa){
      find = { ...find, empresa: query.empresa };
    }

		const clientes = await UsuarioModel.find(find);

		return res.json({
			ok: true,
			clientes,
		});
	};

  eliminar = async (req, res) => {
    const id = req.params.id;

		try {
			await UsuarioModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}

module.exports = new AuthController();
