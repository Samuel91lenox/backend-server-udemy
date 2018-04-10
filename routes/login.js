var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app = express();

var Usuario = require('../models/usuario');

var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;

const GOOGLE_CLIENTE_ID = require('../config/config').GOOGLE_CLIENTE_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;

//================================================
// Autenticacion Google
// =================================================
app.post('/google', (req, res) => {

    var token = req.body.token || 'XXX';

    var client = new OAuth2Client(GOOGLE_CLIENTE_ID, GOOGLE_SECRET, '');

    client.verifyToken(token, GOOGLE_CLIENTE_ID, function(e, login) {

        if (e) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Token no valido',
                error: e
            });
        }

        var payload = login.getPayload();
        var userid = payload['sub'];

        Usuario.findOne({ email: payload.email }, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario - login',
                    error: err
                });
            }

            if (usuario) {
                if (usuario.google === false) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Debe de usar su autenticacion normal'
                    });
                } else {
                    usuario.password = ':)';

                    var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 })


                    response.status(200).json({
                        ok: true,
                        usuario: usuario,
                        token: token,
                        id: usuario._id

                    });
                }
                //Si el usuario no existe por email
            } else {
                var usuario = new Usuario();

                usuario.nombre = payload.name;
                usuario.email = payload.email;
                usuario.password = ':)';
                usuario.img = payload.picture;
                usuario.google = true;

                usuario.save((err, usuarioDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al crear usuario - google',
                            error: err
                        });
                    }
                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })

                    response.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token: token,
                        id: usuarioDB._id

                    });
                });
            }
        });
    });


});



//================================================
//Autenticacion normal
// =================================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios!',
                errors: err
            });
        }

        if (!usuarioDB) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //Crear un token
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })


        response.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });


});




module.exports = app;