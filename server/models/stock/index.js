const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let stockSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  cantidad: {
    type: String
  },
  almacen: {
		type: mongoose.Schema.Types.String,
		ref: "Almacenes",
	},
  variante: {
		type: mongoose.Schema.Types.String,
		ref: "Variante",
	},
  producto: {
		type: mongoose.Schema.Types.String,
		ref: "Producto",
	},
  empresa: {
		type: mongoose.Schema.Types.String,
		ref: "Usuario",
	},
});

stockSchema.methods.toJSON = function () {
  let stock = this;
  let stockObject = stock.toObject();
  return stockObject;
};

stockSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Stock", stockSchema);
