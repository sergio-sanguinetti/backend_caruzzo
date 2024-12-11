const AnuncioModel = require("../../models/anuncio/index");

const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");

const { limpiarUrl } = require("../../utils/url");

class AnunciosController {
  constructor() { }

  registro = async (req, res) => {
    const body = req.body;
    const id = new mongoose.Types.ObjectId();

    const archivo = req.file;
    let nombreImagen = "";

    if(archivo){
      nombreImagen = `${limpiarUrl(body.nombre)}${path.extname(archivo.originalname)}`;

      const pathArchivo = path.resolve(
        __dirname,
        `../../../src/imagenes-anuncios/${nombreImagen}`
      );

      fs.writeFileSync(pathArchivo, archivo.buffer);
    }

    const data = new AnuncioModel({
      _id: id.toString(),
      nombre: body.nombre,
      tipo: body.tipo,
      pagina: body.pagina,
      anuncio: body.anuncio,
      imagen: nombreImagen,
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

  anuncios = async (req, res) => {
		let find = {};
    const query = req.query;

		if(req.usuario.rol === "EMPRESA" && query.tipo){
      find = { tipo: "General" };
    }

		let anuncios = await AnuncioModel.find(find);

    if(!anuncios.length) {

      if(req.usuario.rol === "EMPRESA" && query.tipo){
        find = { tipo: query.tipo };
      }

      anuncios = await AnuncioModel.find(find);
    }

		return res.json({
			ok: true,
			anuncios,
		});
	};

  eliminar = async (req, res) => {
    const id = req.params.id;

		try {
			await AnuncioModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}

module.exports = new AnunciosController();