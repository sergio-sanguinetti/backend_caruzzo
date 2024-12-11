const UsuarioModel = require("../../models/usuario/index");

const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const { SEED } = require("../../config/env");

const fs = require('fs');
const path = require('path');


class AuthController {
  constructor() { }

  login = async (req, res) => {
    const body = req.body;



    UsuarioModel.findOne({ correo: body.correo }, async (err, usuarioBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      

      if (!usuarioBD) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario o contraseña incorrectos.",
          },
        });
      }

      if (Number(usuarioBD.login_erroneos) >= 5) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Has superado el límite de intentos por hoy.",
          },
        });
      }

      if (!bcrypt.compareSync(body.contrasena, usuarioBD.contrasena))
      {
        await UsuarioModel.findByIdAndUpdate(usuarioBD._id, {
          login_erroneos: Number(usuarioBD.login_erroneos) + 1,
        });

        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario o contraseña incorrectos.",
          },
        });
      }

      const token = jwt.sign(
        {
          usuarioID: usuarioBD._id,
          rol: usuarioBD.rol
        },
        SEED,
        { expiresIn: "24h" }
      );

      const rol_usuario = usuarioBD.rol;

      return res.json({ ok: true, token,rol_usuario });
    });
  };

  registro = async (req, res) => {
    const body = req.body;
    const id = new mongoose.Types.ObjectId();

    const data = new UsuarioModel({
      _id: id.toString(),
      nombre: body.nombre,
      correo: body.correo,
      contrasena: bcrypt.hashSync(body.contrasena, 10),
      rol: "VENDEDOR",
      membresia: "",
      tipo_lote: "",
      inicio_membresia: "",
      fin_membresia: "",
      validado: 0,
    })

    try {
      // Guarda el usuario en la base de datos
      await data.save();
  
      return res.status(201).json({
        ok: true,
        message: "Usuario registrado con éxito",
      });
    } catch (error) {
      // Manejo del error
      if (error.code === 11000) {
        return res.status(400).json({
          ok: false,
          message: "El correo ya está registrado. Intente con otro correo.",
        });
      }
  
      console.error(error);
      return res.status(500).json({
        ok: false,
        message: "Error interno del servidor. Por favor, intente nuevamente.",
      });
    }
  }

 
  actualizacion = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const arreglo_datos = JSON.parse(body.datos);
    const directorio = `src/imagenes_perfil`;


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
      // IMAGEN PERFIL 
      ////////////////////// 
      // Aquí obtenemos los archivos adjuntos si existen
      const foto_perfil = req.files && req.files.foto_perfil ? req.files.foto_perfil : null;
      let url_foto = '';
      if (foto_perfil) {
    
           const extension = path.extname(foto_perfil.name);

     
           const nuevoNombre = 'logo_'+ id + extension;
          
           url_foto = nuevoNombre;


           // Guardar el archivo en el servidor
             foto_perfil.mv(path.join(directorio, nuevoNombre), err => {



             if (err) {
               console.error('Error al guardar el documento:', err);
               // res.status(500).json({ error: 'Error al guardar el documento' });
             } else {
               console.log('Documento guardado correctamente'+url_foto);
               // res.status(200).json({ message: 'Documento guardado correctamente' });
             }
           });

         

        } else {
          console.error('No se recibió ningún archivo logo en la solicitud');
          // Manejar la situación donde no se recibe ningún archivo
          url_foto = "";
        }


    let data = {
      nombre: arreglo_datos.nombre,
      apoderado_legal: arreglo_datos.apoderado_legal,
      correo: arreglo_datos.correo,
      telefono: arreglo_datos.telefono,
      rfc: arreglo_datos.rfc,
      ubicacion: arreglo_datos.ubicacion,
      imagen_perfil: url_foto,
    };



    try {
      await UsuarioModel.findByIdAndUpdate(id, data);
      res.json({ ok: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, message: "Error al actualizar el usuario" });
    }
  };

  actualizacionAdmin = async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    let data = {
      nombre: body.nombre,
      apoderado_legal: body.apoderado_legal,
      correo: body.correo,
      telefono: body.telefono,
      membresia: body.tipo_membresia,
      inicio_membresia: body.inicio_membresia,
      fin_membresia: body.fin_membresia,
      rfc: body.rfc,

    };

    try {
      await UsuarioModel.findByIdAndUpdate(id, data);
      res.json({ ok: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, message: "Error al actualizar el usuario" });
    }
  };

  validarVendedor = async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    let data = {
      validado: body.validado
    };

    try {
      await UsuarioModel.findByIdAndUpdate(id, data);
      res.json({ ok: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, message: "Error al actualizar el usuario" });
    }
  };

  // async registro(req, res) {
  //   const body = req.body;

  //   const id = new mongoose.Types.ObjectId();

  //   const usuario = new Usuario({
  //     _id: id.toString(),
  //     usuario: body.usuario,
  //     correo: body.correo,
  //     nombre: body.nombre,
  //     nombre_tpv: body.nombre_tpv,
  //     ref_cliente: body.cliente,
  //     coste: body.coste.toString(),
  //     contrasena: bcrypt.hashSync(body.password, 10),
  //     extensiones: body.extensiones,
  //     servicios: body.servicios,
  //     rol: body.rol,
  //     ausente: body.ausente,
  //     licencia: body.licencia,
  //     trabajando_fuera_horario: body.trabajando,
  //     agentes_habilitados: body.agentesHabilitados.toString(),
  //     precio_trafico: body.precio_trafico,
  //     precio_trafico_movil: body.precio_trafico_movil,
  //     porcentaje_comision_tarifas: body.porcentaje_comision_tarifas,
  //     tpv_activado: body.tpvActivado,
  //     tpv_activado_usuario_principal: body.tpvActivadoUsuarioPrincipal,
  //     tpv_comision: body.tpvComision.toString(),
  //     servicios_a_cobrar: body.serviciosCobro,
  //     tpv_cliente_asociado: body.tpvAsociado.toString(),
  //     gabinete: body.gabinete,
  //     cartera: body.cartera,
  //     estadisticas_habilitadas: body.estadisticas_habilitadas,
  //     llamadas_salientes: body.llamadas_salientes,
  //     deshabilitar_llamadas_entrantes: body.deshabilitar_llamadas_entrantes,
  //     cobro_en_tramos: body.cobro_en_tramos,
  //     permisos_basicos: body.permisos_basicos
  //   });

  //   await carteraController.create(id.toString());

  //   usuario.save((err, usuarioBD) => {
  //     if (err) {
  //       return res.status(400).json({
  //         ok: false,
  //         contenido: err,
  //       });
  //     }

  //     return res.json({
  //       ok: true,
  //       contenido: { id: usuarioBD._id },
  //     });
  //   });
  // }

  usuario(req, res) {
    let token = req.get("token");

    if (token) token = token.split("Bearer ").join("");
    else
      return res.status(400).json({
        ok: false,
        contenido: {},
      });

    jwt.verify(token, SEED, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          contenido: {},
        });
      }

      let usuarioBD = await UsuarioModel.findById(decoded.usuarioID);

      res.json({ ok: true, user: usuarioBD });
    });
  }

  obtenerUsuario = async (req, res) => {
    const id = req.params.id;

    const usuarioBD = await UsuarioModel.findById(id);

    res.json({ ok: true, usuario: usuarioBD });
  }

  usuarios = async (req, res) => {
		let find = {};
    const query = req.query;

		if (req.query.rol) {
			find = { ...find, rol: query.rol };
		}

		const usuarios = await UsuarioModel.find(find);

		return res.json({
			ok: true,
			usuarios,
		});
	};

  vendedores = async (req, res) => {
		let find = {};
    const query = req.query;


			find = { ...find, rol: 'VENDEDOR' };


		const vendedores = await UsuarioModel.find(find);

		return res.json({
			ok: true,
			vendedores,
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

  // recuperarUsuario = async (req, res) => {
  //   const body = req.body;

  //   const usuarioBD = await Usuario.findOne({ usuario: body.usuario });

  //   if (!usuarioBD) {
  //     return res.status(400).json({
  //       ok: false,
  //       contenido: {
  //         err: {
  //           message: "Usuario no encontrado",
  //         },
  //       },
  //     });
  //   }

  //   if (
  //     usuarioBD.cod_recuperacion === "" ||
  //     body.codigo !== usuarioBD.cod_recuperacion
  //   ) {
  //     return res.status(400).json({
  //       ok: false,
  //       contenido: {
  //         err: {
  //           message: "Código incorrecto",
  //         },
  //       },
  //     });
  //   }

  //   await Usuario.findByIdAndUpdate(usuarioBD._id, {
  //     contrasena: bcrypt.hashSync(body.password, 10),
  //     login_fallidos: "0",
  //     cod_recuperacion: "",
  //   });

  //   return res.json({
  //     ok: true,
  //     contenido: {},
  //   });
  // };

  // generarCodigoRecuperacion = async (req, res) => {
  //   const body = req.body;

  //   const usuarioBD = await Usuario.findOne({ usuario: body.usuario });

  //   if (!usuarioBD) {
  //     return res.status(400).json({
  //       ok: false,
  //       contenido: {
  //         err: {
  //           message: "Usuario no encontrado",
  //         },
  //       },
  //     });
  //   }

  //   const cod_recuperacion = Math.floor(
  //     Math.random() * (999999 - 111111 + 1) + 111111
  //   );

  //   let transporter = nodemailer.createTransport({
  //     host: "mail.gtphone.es",
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: "soporte@gtphone.es",
  //       pass: "y5gVpLWwOUCHaT9",
  //     },
  //     tls: {
  //       rejectUnauthorized: false,
  //     },
  //   });

  //   try {
  //     await transporter.sendMail({
  //       from: "soporte@gtphone.es",
  //       to: `${usuarioBD.correo}`,
  //       subject: "Código de recuperación",
  //       html: `<h1>${cod_recuperacion}</h1>`,
  //     });
  //   } catch (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       contenido: {},
  //     });
  //   }

  //   await Usuario.findByIdAndUpdate(usuarioBD._id, {
  //     cod_recuperacion,
  //   });

  //   return res.json({
  //     ok: true,
  //     contenido: {},
  //   });
  // };
}

module.exports = new AuthController();
