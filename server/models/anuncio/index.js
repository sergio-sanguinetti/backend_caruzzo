const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let anuncioSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.String,
  },
  nombre: {
    type: String,
  },
  tipo: {
    type: String,
    default: "General"
  },
  pagina: {
    type: String
  },
  anuncio: {
    type: String
  },
  imagen: {
    type: String
  }
});

anuncioSchema.methods.toJSON = function () {
  let anuncio = this;
  let anuncioObject = anuncio.toObject();
  return anuncioObject;
};

anuncioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Anuncio", anuncioSchema);
