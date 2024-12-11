const ProductoModel = require("../../models/producto/index");
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
//             cb(null, __dirname+`../../../src/imagenes-productos/`);
            
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


class ProductosController {
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
    const data = new ProductoModel({
      _id: id.toString(),
      referenciaProducto: body.referenciaProducto,
      nombreProducto: body.nombreProducto,
      baseVenta: body.baseVenta,
      codigoBarras: body.codigoBarras,
      familiaProductos: body.familiaProductos,
      stockReal: body.stockReal,
      stockVirtual: body.stockVirtual,
      stockMinimo: body.stockMinimo,
      descripcion: body.descripcion,
      precioCompra: body.precioCompra,
      precioVenta: body.precioVenta,
      precioMinimo: body.precioMinimo,
      descuento: body.descuento,
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
      referenciaProducto: body.referenciaProducto,
      nombreProducto: body.nombreProducto,
      baseVenta: body.baseVenta,
      codigoBarras: body.codigoBarras,
      familiaProductos: body.familiaProductos,
      stockReal: body.stockReal,
      stockVirtual: body.stockVirtual,
      stockMinimo: body.stockMinimo,
      descripcion: body.descripcion,
      precioCompra: body.precioCompra,
      precioVenta: body.precioVenta,
      precioMinimo: body.precioMinimo,
      descuento: body.descuento,
      imagenes : imagen,
      empresa: body.empresa
    }

    

    try {
  
     await ProductoModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }
    res.json({ ok: true });
  }


  producto = async (req, res) => {
    const id = req.params.id;

    const producto = await ProductoModel.findById(id);

    return res.json({
			ok: true,
			producto,
		});
  }

  productos = async (req, res) => {
		let find = {};
    const query = req.query;

		if(req.usuario.rol === "EMPRESA"){
      find = { ...find, empresa: req.usuario.id };
    }

    if(req.usuario.rol === "ADMIN" && query.empresa){
      find = { ...find, empresa: query.empresa };
    }

		let productos = await ProductoModel.find(find).populate(["fabricante"]);

    for (let index = 0; index < productos.length; index++) {
      const producto = productos[index];

      let findStock = { producto: producto._id };

      if(query.almacen) {
        findStock = { ...findStock, almacen: query.almacen };
      }

      const stock = await StockModel.findOne(findStock);

      if(stock){
        productos[index] = {
          ...productos[index].toJSON(),
          stock: stock.cantidad || 0
        };
      }
    }

		return res.json({
			ok: true,
			productos,
		});
	};

  importarImagen = async (req, res) => {
    const body = req.body;

    const archivo = req.file;
    let nombreImagen = "";

    const producto = await ProductoModel.findById(body.producto).select(["nombreProduto", "imagenes"]);

    console.log(producto);

    try {
      if(archivo){
        nombreImagen = `${limpiarUrl(producto.nombre)}-${new Date().getTime()}${path.extname(archivo.originalname)}`;
  
        const pathArchivo = path.resolve(
          __dirname,
          `../../../src/imagenes-productos/${nombreImagen}`
        );
  
        fs.writeFileSync(pathArchivo, archivo.buffer);

        await ProductoModel.findByIdAndUpdate(producto._id, { imagenes: [...producto.imagenes, nombreImagen ] })
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
			await ProductoModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}
module.exports = new ProductosController();
