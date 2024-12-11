const SolicitudVendedorModel = require("../../models/solicitudes-vendedor/index");

const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const { SEED } = require("../../config/env");

const moment = require('moment-timezone');

const fs = require('fs');
const path = require('path');

class SolicitudesVendedorController {
  constructor() { }

  registro = async (req, res) => {
    const body = req.body;
    const id = new mongoose.Types.ObjectId();


    const arreglo_datos = JSON.parse(body.datos);
    const directorio = `src/documentos_soporte/`+arreglo_datos.usuario;

      // Verificar si el directorio ya existe
      if (!fs.existsSync(directorio)) {
        // Si no existe, crearlo
        fs.mkdirSync(directorio, { recursive: true }, (err) => {
          if (err) {
            console.error('Error al crear el directorio:', err);
          } else {
            console.log('Directorio creado correctamente');
          }
        });
      }


        ////////////////////// 
      // ADJUNTO SOLICITUD 
      ////////////////////// 
      // Aquí obtenemos los archivos adjuntos si existen
      const adjunto_solicitud = req.files && req.files.adjunto_solicitud ? req.files.adjunto_solicitud : null;
      let url_adjunto = '';
      if (adjunto_solicitud) {
    
           const extension = path.extname(adjunto_solicitud.name);

     
           const nuevoNombre = 'solicitud_'+ id + extension;
          
           url_adjunto = nuevoNombre;


           // Guardar el archivo en el servidor
             adjunto_solicitud.mv(path.join(directorio, nuevoNombre), err => {



             if (err) {
               console.error('Error al guardar el documento:', err);
               // res.status(500).json({ error: 'Error al guardar el documento' });
             } else {
               console.log('Documento guardado correctamente'+url_adjunto);
               // res.status(200).json({ message: 'Documento guardado correctamente' });
             }
           });

         

        } else {
          console.error('No se recibió ningún archivo adjunto en la solicitud');
          // Manejar la situación donde no se recibe ningún archivo
          url_adjunto = "";
        }




    const data = new SolicitudVendedorModel({
      _id: id.toString(),
      usuario: arreglo_datos.usuario,
      tipo_solicitud: arreglo_datos.tipo_solicitud,
      detalle_solicitud: arreglo_datos.detalle_solicitud,
      url_adjunto,
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
      await SolicitudVendedorModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }

    res.json({ ok: true });
  }
  actualizacionEstado = async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    let data = {
        estado: body.estado,
    }

    try {
      await SolicitudVendedorModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }

    res.json({ ok: true });
  }

  obtenerSolicitud = async (req, res) => {
    
    const id = req.params.id;

    const solicitudesBD = await SolicitudVendedorModel.findById(id);

    res.json({ ok: true, solicitud: solicitudesBD });

  }

  obtenerSolicitudesVendedor = async (req, res) => {
    
    const usuario = req.params.usuario;
    try {

      const solicitudesBD = await SolicitudVendedorModel.find({ usuario });
  
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
		let find = {};
    const query = req.query;

		// if(req.usuario.rol === "EMPRESA"){
    //   find = { ...find, empresa: req.usuario.id };
    // }

    // if(req.usuario.rol === "ADMIN" && query.empresa){
    //   find = { ...find, empresa: query.empresa };
    // }

		const solicitudes = await SolicitudVendedorModel.find({});

		return res.json({
			ok: true,
			solicitudes,
		});
	};

  eliminar = async (req, res) => {
    const id = req.params.id;

		try {
			await SolicitudVendedorModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}

module.exports = new SolicitudesVendedorController();
