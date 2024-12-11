const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let LosteSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  usuario: { type: String, required: true },
  nombre_lote: { type: String, required: true },
  nro_vehiculos: { type: Number, required: true },
  nombre_lote: { type: String, required: true },
  direccion: { type: String, required: true },
  url: { type: String, required: true },
  telefono: { type: String, required: true },
  tipo: { type: String, required: true },
  estado: { type: Number },
});

LosteSchema.methods.toJSON = function () {
  let lote = this;
  let loteObject = lote.toObject();
  delete loteObject.contrasena;

  return loteObject;
};

LosteSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Lotes", LosteSchema);
