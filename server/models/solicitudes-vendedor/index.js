const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let SolicitudVendedorSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  usuario: { type: String, required: true },
  tipo_solicitud: { type: String, required: true },
  detalle_solicitud: { type: String, required: true },
  url_adjunto: { type: String },
  estado: { type: Number },
  fecha_creacion: { type: Date },
});

SolicitudVendedorSchema.methods.toJSON = function () {
  let solicitud = this;
  let solicitudObject = solicitud.toObject();
  delete solicitudObject.contrasena;

  return solicitudObject;
};

SolicitudVendedorSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("SolicitudesVendedor", SolicitudVendedorSchema);
