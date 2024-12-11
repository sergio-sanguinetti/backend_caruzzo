const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  correo: {
    type: String,
  },
  nombre: {
    type: String,
  },
  documento: {
    type: String,
  },
  tipo: {
    type: String,
  },
  id_fiscal: {
    type: String,
  },
  razon_social: {
    type: String,
  },
  telefono: {
    type: String,
  },
  telefono2: {
    type: String,
  },
  observaciones: {
    type: String,
  },
  empresa: {
		type: mongoose.Schema.Types.String,
		ref: "Usuario",
	},
});

usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.contrasena;

  return userObject;
};

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Cliente", usuarioSchema);
