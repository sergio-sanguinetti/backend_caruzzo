const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let membresiaSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  vendedor: {
    type: String
  },
  membresia: {
    type: Number
  },
  estado: { type: Number },
  precio: { type: Number },
  metodo_pago: { type: String },
  id_pago: { type: String },
  invoice: { type: String },
  fecha_creacion: { type: Date },
  fecha_inicio: { type: Date },
  fecha_fin: { type: Date },
});

membresiaSchema.methods.toJSON = function () {
  let membresia = this;
  let membresiaObject = membresia.toObject();
  return membresiaObject;
};

membresiaSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Membresias", membresiaSchema);
