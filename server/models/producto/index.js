const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let productoSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  referenciaProducto: {
    type: String
  },
  nombreProducto: {
    type: String
  },
  baseVenta: {
    type: String
  },
  codigoBarras: {
    type: String
  },
  familiaProductos: {
    type: String
  },
  stockReal: {
    type: String
  },
  stockVirtual: {
    type: String
  },
  stockMinimo: {
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

productoSchema.methods.toJSON = function () {
  let producto = this;
  let productoObject = producto.toObject();
  return productoObject;
};

productoSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Producto", productoSchema);
