const VehiculoModel = require("../../models/vehiculo/index");

const UsuarioModel = require("../../models/usuario/index");


const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const { SEED } = require("../../config/env");

const fs = require('fs');
const path = require('path');


const moment = require('moment-timezone');

class AuthController {
  constructor() { }

  registro = async (req, res) => {
    const body = req.body;
    const id = new mongoose.Types.ObjectId();
    const arreglo_datos = JSON.parse(body.datos);

    const directorio = `src/imagenes_vehiculo/` + id;

    // Verificar si el directorio ya existe, si no, crearlo
    if (!fs.existsSync(directorio)) {
        fs.mkdirSync(directorio, { recursive: true }, (err) => {
            if (err) console.error('Error al crear el directorio:', err);
        });
    }

    // Objeto para almacenar las fotos con claves específicas
    const fotos = {};

    // Función para procesar las imágenes
    const procesarImagen = (archivo, clave) => {
        if (archivo) {
            const extension = path.extname(archivo.name);
            const nuevoNombre = `${clave}_${id}${extension}`;
            const rutaCompleta = path.join(directorio, nuevoNombre);

            archivo.mv(rutaCompleta, (err) => {
                if (err) {
                    console.error(`Error al guardar la imagen ${clave}:`, err);
                } else {
                    console.log(`Imagen ${clave} guardada correctamente`);
                }
            });

            fotos[clave] = nuevoNombre; // Añadir la clave y la URL al objeto fotos
        } else {
            console.error(`No se recibió la imagen ${clave}`);
        }
    };

    // Procesar cada imagen con su clave específica
    procesarImagen(req.files?.frente, 'foto_frente');
    procesarImagen(req.files?.derecho, 'foto_derecho');
    procesarImagen(req.files?.izquierdo, 'foto_izquierdo');
    procesarImagen(req.files?.trasera, 'foto_trasera');
    procesarImagen(req.files?.motor, 'foto_motor');
    procesarImagen(req.files?.llantas, 'foto_llantas');
    procesarImagen(req.files?.tablero, 'foto_tablero');
    procesarImagen(req.files?.interiores, 'foto_interiores');

    // Crear el modelo con los datos y las fotos
    const data = new VehiculoModel({
        _id: id.toString(),
        usuario: arreglo_datos.usuario,
        nombre: arreglo_datos.nombre,
        modelo: arreglo_datos.modelo,
        lote: arreglo_datos.lote,
        kilometraje: arreglo_datos.kilometraje,
        transmicion: arreglo_datos.transmicion,
        marca: arreglo_datos.marca,
        anio: arreglo_datos.anio,
        ubicacion: arreglo_datos.ubicacion,
        descripcion: arreglo_datos.descripcion,
        precio: arreglo_datos.precio,
        estado: 0,
        validado: 0,
        fotos, // Guardar el objeto fotos en el modelo
        fecha_creacion: moment().tz("America/Mexico_City").toDate(),
    });

    try {
        await data.save();
        return res.json({ ok: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, error: 'Error al registrar el vehículo' });
    }
};


  actualizacion = async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    let data = {
      usuario: body.usuario,
      nombre: body.nombre,
      modelo: body.modelo,
      kilometraje: body.kilometraje,
      transmicion: body.transmicion,
      marca: body.marca,
      anio: body.anio,
      ubicacion: body.ubicacion,
      descripcion: body.descripcion,
      precio: body.precio,
      estado: body.estado,
    }

    try {
      await VehiculoModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }

    res.json({ ok: true });
  }

  actualizacionEstado = async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    let data = {
      validado: body.validado,
    }

    try {
      await VehiculoModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }

    res.json({ ok: true });
  }

  obtenerVehiculo = async (req, res) => {
    try {
      const id = req.params.id;
  
      // Obtiene el vehículo de la base de datos
      const vehiculoBD = await VehiculoModel.findById(id);
      if (!vehiculoBD) {
        return res.status(404).json({ ok: false, message: "Vehículo no encontrado" });
      }
  
      // Obtiene el usuario asociado al vehículo
      const usuarioBD = await UsuarioModel.findById(vehiculoBD.usuario);
      if (!usuarioBD) {
        return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
      }
  
      // Combina los datos del vehículo y usuario
      const vehiculoConUsuario = {
        ...vehiculoBD.toObject(),
        usuario: {
          nombre: usuarioBD.nombre,
          correo: usuarioBD.correo,
          imagen_perfil: usuarioBD.imagen_perfil
        }
      };
  
      // Envía la respuesta con los datos combinados
      res.json({ ok: true, vehiculo: vehiculoConUsuario });
    } catch (error) {
      console.error("Error obteniendo el vehículo:", error);
      res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
  };
  

  obtenerVehiculosVendedor = async (req, res) => {
    
    const usuario = req.params.usuario;
    try {

      const vehiculosBD = await VehiculoModel.find({ usuario });
  
      if (!vehiculosBD || vehiculosBD.length === 0) {
        return res.status(404).json({
          ok: false,
          message: 'No se encontraron vehículos para este usuario',
        });
      }
  
      return res.json({
        ok: true,
        vehiculos: vehiculosBD,
      });
    } catch (error) {
      console.error('Error al obtener los vehículos:', error);
      return res.status(500).json({
        ok: false,
        message: 'Error al buscar los vehículos',
      });
    }
    
  };
  

  vehiculos = async (req, res) => {
    try {
      // Obtiene todos los vehículos de la base de datos
      const vehiculosBD = await VehiculoModel.find();
  
      if (!vehiculosBD || vehiculosBD.length === 0) {
        return res.status(404).json({ ok: false, message: "No se encontraron vehículos" });
      }
  
      // Recorrer todos los vehículos y obtener la información del usuario asociado
      const vehiculosConUsuarios = await Promise.all(
        vehiculosBD.map(async (vehiculo) => {
          const usuarioBD = await UsuarioModel.findById(vehiculo.usuario);
  
          return {
            ...vehiculo.toObject(),
            usuario: usuarioBD
              ? { nombre: usuarioBD.nombre, correo: usuarioBD.correo }
              : null, // Si no se encuentra el usuario, devuelve null
          };
        })
      );
  
      // Enviar la respuesta con los datos combinados
      res.status(200).json({ ok: true, vehiculos: vehiculosConUsuarios });
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
      res.status(500).json({ ok: false, message: "Error al obtener vehículos" });
    }
	};

  vehiculosAleatorios = async (req, res) => {
    try {
      // Obtener 4 vehículos aleatorios donde validado sea igual a 1
      const vehiculos = await VehiculoModel.aggregate([
        { $match: { validado: 1 } }, // Filtrar solo los vehículos validados
        { $sample: { size: 4 } } // Seleccionar 4 documentos aleatoriamente
      ]);
  
      return res.json({
        ok: true,
        vehiculos,
      });
    } catch (error) {
      console.error("Error al obtener vehículos aleatorios:", error);
      return res.status(500).json({
        ok: false,
        message: "Error al obtener vehículos aleatorios"
      });
    }
  };
  

  eliminar = async (req, res) => {
    const id = req.params.id;

		try {
			await VehiculoModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}

module.exports = new AuthController();
