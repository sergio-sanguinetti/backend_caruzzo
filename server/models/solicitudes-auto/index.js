const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let SolicitudAutoSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  id_auto: { type: String, required: true },
  nombre_completo: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  ine: { type: String, required: true },
  estado: { type: Number },
  fecha_creacion: { type: Date },
});

SolicitudAutoSchema.methods.toJSON = function () {
  let solicitud = this;
  let solicitudObject = solicitud.toObject();
  delete solicitudObject.contrasena;

  return solicitudObject;
};

SolicitudAutoSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("SolicitudAuto", SolicitudAutoSchema);
