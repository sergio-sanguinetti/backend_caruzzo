const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let activosSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  referenciaActivo: {
    type: String
  },
  nombreActivo: {
    type: String
  },
  identificador: {
    type: String
  },
  numeroSerie: {
    type: String
  },
  marca: {
    type: String
  },
  modelo: {
    type: String
  },
  cliente: {
    type: String
  },
  direccion: {
    type: String
  },
  inicioFechaG: {
    type: String
  },
  finFechaG: {
    type: String
  },
  descripcion: {
    type: String
  },
  observaciones: {
    type: String
  },
  imagenes: {
    type: String
  },
  // imagenes: {
  //   type: Array
  // },
  // fabricante: {
	// 	type: mongoose.Schema.Types.String,
	// 	ref: "Fabricante",
	// },
  empresa: {
		type: mongoose.Schema.Types.String,
		ref: "Usuario",
	},
});

activosSchema.methods.toJSON = function () {
  let activo = this;
  let activooObject = activo.toObject();
  return activooObject;
};

activosSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Activo", activosSchema);
