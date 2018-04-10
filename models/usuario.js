var mongoose = require('mongoose');
var uniquerValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario.'] },
    correo: { type: String, unique: true, required: [true, 'El correo es necesario.'] },
    password: { type: String, required: [true, 'La constraseña es necesario.'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_PROFILE', enum: rolesValidos },
    google: { type: Boolean, required: true, default: false }
});

usuarioSchema.plugin(uniquerValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);