const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let servicioSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  referenciaServicio: {
    type: String
  },
  nombreServicio: {
    type: String
  },
  baseVenta: {
    type: String
  },
  descripcion: {
    type: String
  },
  precioCompra: {
    type: String
  },
  precioVenta: {
    type: String
  },
  precioMinimo: {
    type: String
  },
  descuento: {
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

servicioSchema.methods.toJSON = function () {
  let servicio = this;
  let servicioObject = servicio.toObject();
  return servicioObject;
};

servicioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Servicio", servicioSchema);
