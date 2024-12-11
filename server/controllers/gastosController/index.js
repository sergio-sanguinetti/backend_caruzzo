const GastoModel = require("../../models/gasto/index");
const StockModel = require("../../models/stock/index");

const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");

const { limpiarUrl } = require("../../utils/url");

const multer = require('multer');


class GastosController {
  constructor() { }

  registro = async (req, res) => {
    const body = req.body;
    const id = new mongoose.Types.ObjectId();
  
    var  imagen= "";
    const data = new GastoModel({
      _id: id.toString(),
      referenciaGasto: body.referenciaGasto,
      nombreGasto: body.nombreGasto,
      precioCompra: body.precioCompra,
      igv: body.igv,
      tipoGasto: body.tipoGasto,
      categoria: body.categoria,
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
      referenciaGasto: body.referenciaGasto,
      nombreGasto: body.nombreGasto,
      precioCompra: body.precioCompra,
      igv: body.igv,
      tipoGasto: body.tipoGasto,
      categoria: body.categoria,
      descripcion: body.descripcion,
      observaciones: body.observaciones,
      imagenes : imagen,
      empresa: body.empresa
    }

    

    try {
  
     await GastoModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }
    res.json({ ok: true });
  }


  gasto = async (req, res) => {
    const id = req.params.id;

    const gasto = await GastoModel.findById(id);

    return res.json({
			ok: true,
			gasto,
		});
  }

  gastos = async (req, res) => {
		let find = {};
    const query = req.query;

		if(req.usuario.rol === "EMPRESA"){
      find = { ...find, empresa: req.usuario.id };
    }

    if(req.usuario.rol === "ADMIN" && query.empresa){
      find = { ...find, empresa: query.empresa };
    }

		let gastos = await GastoModel.find(find).populate(["fabricante"]);

    for (let index = 0; index < gastos.length; index++) {
      const servicio = gastos[index];

      let findStock = { servicio: servicio._id };

      if(query.almacen) {
        findStock = { ...findStock, almacen: query.almacen };
      }

      const stock = await StockModel.findOne(findStock);

      if(stock){
        gastos[index] = {
          ...gastos[index].toJSON(),
          stock: stock.cantidad || 0
        };
      }
    }

    // const contentType = imagen.headers['content-type'];
    // const imageData = Buffer.from(imagen.data, 'binary').toString('base64');

    // const image = `data:${contentType};base64,${imageData}`;

		return res.json({
			ok: true,
			gastos,
		});
	};

  importarImagen = async (req, res) => {
    const body = req.body;

    const archivo = req.file;
    let nombreImagen = "";

    // const servicio = await GastoModel.findById(body.nombreServicio).select(["nombreServicio", "imagenes"]);
    const servicio = await GastoModel.findOne({"nombreServicio" : body.nombreServicio}).select(["_id","nombreServicio", "imagenes"]);

    // console.log(servicio._id);

    

    try {
      if(archivo){
        nombreImagen = `${limpiarUrl(servicio.nombreServicio)}-${new Date().getTime()}${path.extname(archivo.originalname)}`;

  
        const pathArchivo = path.resolve(
          __dirname,
          `../../../src/imagenes-servicios/${nombreImagen}`
        );

 
  
        fs.writeFileSync(pathArchivo, archivo.buffer);

        // console.log(archivo.buffer);

        await GastoModel.findByIdAndUpdate(servicio._id, { imagenes: nombreImagen })
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
			await GastoModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}
module.exports = new GastosController();
