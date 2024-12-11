const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let gastoSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  referenciaGasto: {
    type: String
  },
  nombreGasto: {
    type: String
  },
  precioCompra: {
    type: String
  },
  igv: {
    type: String
  },
  tipoGasto: {
    type: String
  },
  categoria: {
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
  empresa: {
		type: mongoose.Schema.Types.String,
		ref: "Usuario",
	},
});

gastoSchema.methods.toJSON = function () {
  let gasto = this;
  let gastoObject = gasto.toObject();
  return gastoObject;
};

gastoSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Gasto", gastoSchema);
