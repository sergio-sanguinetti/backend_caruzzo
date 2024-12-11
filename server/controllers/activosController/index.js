const ActivoModel = require("../../models/activo/index");
const StockModel = require("../../models/stock/index");

const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");

const { limpiarUrl } = require("../../utils/url");

const multer = require('multer');
// const shortid = require('shortid');

// const configuracionMulter = {
//     storage: fileStorage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, __dirname+`../../../src/imagenes-activos/`);
            
//         },
//         filename: (req, file, cb) => {
//             const extension = file.mimetype.split('/')[1];
//             cb(null, `${shortid.generate()}.${extension}`);
//         }
//     }),
//     fileFilter(req, file, cb) {
//         if ( file.mimetype === 'image/jpeg' ||  file.mimetype ==='image/png' ) {
//             cb(null, true);
//         } else {
//             cb(new Error('Formato No válido'))
//         }
//     },
// }

// // pasar la configuración y el campo
// const upload = multer(configuracionMulter).single('imagen');

// // Sube un archivo 
// exports.subirArchivo = (req, res, next) => {
//   upload(req, res, function(error) {
//       if(error) {
//           res.json({mensaje: error})
//       }
//       return next();
//   })
// }


class ActivosController {
  constructor() { }

  registro = async (req, res) => {
    const body = req.body;
    const id = new mongoose.Types.ObjectId();

      // if(req.file){
      //   var imagen= "";
      //    console.log(req);
      //  } else {
      //    var  imagen= "";
      //  }
  
       var  imagen= "";
    const data = new ActivoModel({
      _id: id.toString(),
      referenciaActivo: body.referenciaActivo,
      nombreActivo: body.nombreActivo,
      identificador: body.identificador,
      marca: body.marca,
      modelo: body.modelo,
      cliente: body.cliente,
      direccion: body.direccion,
      inicioFechaG: body.inicioFechaG,
      finFechaG: body.finFechaG,
      descripcion: body.descripcion,
      observaciones: body.observaciones,
      imagenes : imagen,
      empresa: body.empresa
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

      // if(req.file){
      //   var imagen= "";
      //    console.log(req);
      //  } else {
      //    var  imagen= "";
      //  }
  
       var  imagen= "";
    const data = {
      _id: body._id,
      referenciaActivo: body.referenciaActivo,
      nombreActivo: body.nombreActivo,
      identificador: body.identificador,
      marca: body.marca,
      modelo: body.modelo,
      cliente: body.cliente,
      direccion: body.direccion,
      inicioFechaG: body.inicioFechaG,
      finFechaG: body.finFechaG,
      descripcion: body.descripcion,
      observaciones: body.observaciones,
      imagenes : imagen,
      empresa: body.empresa
    }

    

    try {
  
     await ActivoModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }
    res.json({ ok: true });
  }


  activo = async (req, res) => {
    const id = req.params.id;

    const activo = await ActivoModel.findById(id);

    return res.json({
			ok: true,
			activo,
		});
  }

  activos = async (req, res) => {
		let find = {};
    const query = req.query;

		if(req.usuario.rol === "EMPRESA"){
      find = { ...find, empresa: req.usuario.id };
    }

    if(req.usuario.rol === "ADMIN" && query.empresa){
      find = { ...find, empresa: query.empresa };
    }

		let activos = await ActivoModel.find(find).populate(["fabricante"]);

    for (let index = 0; index < activos.length; index++) {
      const producto = activos[index];

      let findStock = { producto: producto._id };

      if(query.almacen) {
        findStock = { ...findStock, almacen: query.almacen };
      }

      const stock = await StockModel.findOne(findStock);

      if(stock){
        activos[index] = {
          ...activos[index].toJSON(),
          stock: stock.cantidad || 0
        };
      }
    }

		return res.json({
			ok: true,
			activos,
		});
	};

  importarImagen = async (req, res) => {
    const body = req.body;

    const archivo = req.file;
    let nombreImagen = "";

    const producto = await ActivoModel.findById(body.producto).select(["nombreProduto", "imagenes"]);

    console.log(producto);

    try {
      if(archivo){
        nombreImagen = `${limpiarUrl(producto.nombre)}-${new Date().getTime()}${path.extname(archivo.originalname)}`;
  
        const pathArchivo = path.resolve(
          __dirname,
          `../../../src/imagenes-activos/${nombreImagen}`
        );
  
        fs.writeFileSync(pathArchivo, archivo.buffer);

        await ActivoModel.findByIdAndUpdate(producto._id, { imagenes: [...producto.imagenes, nombreImagen ] })
      }

      return res.json({
        ok: true
      })
    } catch (error) {
      console.log(error)
    }
  }

  eliminar = async (req, res) => {
    const id = req.params.id;

		try {
			await ActivoModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}
module.exports = new ActivosController();
