const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let roles = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  email: {
    type: String,
    required: [true, 'El email es necesario'],
    unique: true
  },
  password: {
    type:String,
    required: [true, 'Pass es obligatorio']
  },
  img:{
    type: String,
    default: "penny"
  },
  role:{
    type: String,
    default: 'USER_ROLE',
    enum: roles
  },
  estado:{
    default: true,
    type: Boolean
  },
  google:{
    default: false,
    type: Boolean
  }
});

usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  delete userObject.password;

  return userObject;
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);
