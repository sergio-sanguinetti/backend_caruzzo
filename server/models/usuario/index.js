const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Definición de roles válidos
let rolesValidos = {
  values: ["ADMIN", "VENDEDOR", "USUARIO"],
  message: "{VALUE} no es un rol válido",
};

// Definición del esquema de usuario
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  correo: {
    type: String,
    unique: true, // El correo debe ser único
    required: [true, "El correo es obligatorio"], // Validación
  },
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"], // Validación
  },
  contrasena: {
    type: String,
    required: [true, "La contraseña es obligatoria"], // Validación
  },
  rol: {
    type: String,
    default: "USUARIO",
    enum: rolesValidos,
  },
  membresia: {
    type: Number,
  },
  tipo_lote: {
    type: Number,
  },
  inicio_membresia: {
    type: mongoose.Schema.Types.Date,
  },
  fin_membresia: {
    type: mongoose.Schema.Types.Date,
  },
  validado: {
    type: Number,
  },
  imagen_perfil: {
    type: String,
  },
  apoderado_legal: {
    type: String,
  },
  correo: {
    type: String,
  },
  telefono: {
    type: String,
  },
  rfc: {
    type: String,
  },
  ubicacion: {
    type: String,
  },
  login_erroneos: {
    type: String,
    default: "0",
  },
  alta: {
    type: mongoose.Schema.Types.Date,
    default: Date.now, // Fecha de alta predeterminada
  },
  baja: {
    type: mongoose.Schema.Types.Date,
  },
});

// Método para ocultar la contraseña al devolver el usuario
usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.contrasena; // Elimina la contraseña del objeto devuelto

  return userObject;
};

// Plugin para validación de campos únicos
usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });

// Exporta el modelo
module.exports = mongoose.model("Usuarios", usuarioSchema);
