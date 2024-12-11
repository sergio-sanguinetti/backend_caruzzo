const SolicitudAutoModel = require("../../models/solicitudes-auto/index");
const VehiculoModel = require("../../models/vehiculo/index");

const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const { SEED } = require("../../config/env");

const moment = require('moment-timezone');

class SolicitudesAutosController {
  constructor() { }

  registro = async (req, res) => {
    const body = req.body;
    const id = new mongoose.Types.ObjectId();

    const data = new SolicitudAutoModel({
      _id: id.toString(),
      id_auto: body.id_auto,
      nombre_completo: body.nombre_completo,
      correo: body.correo,
      telefono: body.telefono,
      direccion: body.direccion,
      ine: "ine",
      estado: 0,
      fecha_creacion: moment().tz("America/Mexico_City").toDate(),
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
        tipo_solicitud: body.tipo_solicitud,
        detalle_solicitud: body.detalle_solicitud,
    }

    try {
      await SolicitudAutoModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }

    res.json({ ok: true });
  }

  actualizacionEstadoSolicitud = async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    let data = {
        estado: body.estado,
    }

    try {
      await SolicitudAutoModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }

    res.json({ ok: true });
  }

  obtenerSolicitud = async (req, res) => {
    
    const id = req.params.id;

    const solicitudesBD = await SolicitudAutoModel.findById(id);

    res.json({ ok: true, solicitud: solicitudesBD });

  }

  obtenerSolicitudesVendedor = async (req, res) => {
    
    const usuario = req.params.usuario;
    try {

      const solicitudesBD = await SolicitudAutoModel.find({ usuario });
  
      if (!solicitudesBD || solicitudesBD.length === 0) {
        return res.status(404).json({
          ok: false,
          message: 'No se encontraron solicitudes para este usuario',
        });
      }
  
      return res.json({
        ok: true,
        solicitudes: solicitudesBD,
      });
    } catch (error) {
      console.error('Error al obtener los solicitudes:', error);
      return res.status(500).json({
        ok: false,
        message: 'Error al buscar los solicitudes',
      });
    }
    
  };
  

  solicitudes = async (req, res) => {
    try {
      // Obtiene todas las solicitudes
      const solicitudesBD = await SolicitudAutoModel.find({});
      
      // Itera sobre cada solicitud para buscar el vehículo asociado
      const solicitudesConVehiculo = await Promise.all(
        solicitudesBD.map(async (solicitud) => {
          const vehiculo = await VehiculoModel.findById(solicitud.id_auto);
          return {
            ...solicitud.toObject(),
            vehiculo: vehiculo ? { nombre: vehiculo.nombre } : null, // Agrega el nombre del vehículo
          };
        })
      );
  
      // Responde con las solicitudes enriquecidas con el nombre del vehículo
      return res.json({
        ok: true,
        solicitudes: solicitudesConVehiculo,
      });
    } catch (error) {
      console.error("Error obteniendo las solicitudes:", error);
      res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
  };
  

  eliminar = async (req, res) => {
    const id = req.params.id;

		try {
			await SolicitudAutoModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}

module.exports = new SolicitudesAutosController();
