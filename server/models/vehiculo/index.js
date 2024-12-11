const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let vehiculoSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  nombre: { type: String, required: true },
  usuario: { type: String, required: true },
  modelo: { type: String, required: true },
  lote: { type: String, required: true },
  kilometraje: { type: Number, required: true },
  transmicion: { type: String, required: true },
  marca: { type: String, required: true },
  anio: { type: Number, required: true },
  ubicacion: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  estado: { type: Number },
  validado: { type: Number },
  fotos: { type: Object, required: false },
  fecha_creacion: { type: Date },
});

vehiculoSchema.methods.toJSON = function () {
  let vehiculo = this;
  let vehiculoObject = vehiculo.toObject();
  delete vehiculoObject.contrasena;

  return vehiculoObject;
};

vehiculoSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Vehiculos", vehiculoSchema);
