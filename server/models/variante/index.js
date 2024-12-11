const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let varianteSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  nombre: {
    type: String
  },
  valor: {
    type: String
  },
  precio_base: {
    type: String
  },
  tipo: {
    type: String,
    default: "PADRE"
  },
  guia: {
    type: Boolean,
    default: false
  },
  variantes: {
    type: Array,
    default: []
  },
  padre: {
		type: mongoose.Schema.Types.String,
		ref: "Variante",
	},
  // almacen: {
	// 	type: mongoose.Schema.Types.String,
	// 	ref: "Almacen",
	// },
  producto: {
		type: mongoose.Schema.Types.String,
		ref: "Producto",
	},
  empresa: {
		type: mongoose.Schema.Types.String,
		ref: "Usuario",
	},
});

varianteSchema.methods.toJSON = function () {
  let variante = this;
  let varianteObject = variante.toObject();
  return varianteObject;
};

varianteSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Variante", varianteSchema);
