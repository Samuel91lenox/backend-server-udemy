var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

//=========================================
// Obtener todos los usuarios
// ========================================
app.get('/', (request, response, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios!',
                        errors: err
                    });
                }

                response.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });
});



//=========================================
// Actualizar usuario
// ========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {



        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe.',
                errors: { message: 'No existe un usuario con ese ID.' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });

    usuarioGuardado.password = ':)';

    response.status(200).json({
        ok: true,
        id: id
    });

});



//=========================================
// Crear un nuevo usuario
// ========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: boyd.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        response.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });
});

//=========================================
// Eliminar usuario
// ========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'NO existe un usuario con esa ID',
                errors: { message: 'NO existe un usuario con esa ID' }
            });
        }

        response.status(201).json({
            ok: true,
            usuarioBorrado: usuarioBorrado
        });
    });
});



module.exports = app;