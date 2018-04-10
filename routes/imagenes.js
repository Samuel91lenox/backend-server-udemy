var express = require('express');
var app = express();
var fs = require('fs');


app.get('/:tipo/:img', (request, response, next) => {

    var tipo = request.params.tipo;
    var img = request.params.img;

    var path = `./uploads/${tipo}/${img}`;

    fs.exists(path, existe => {
        if (!existe) {
            path = './assests/no-img.jpg';
        }

        response.sendfile(path);
    });

    // response.status(404).json({
    //     ok: true,
    //     mensaje: 'Peticion realizada correctamente'
    // });
});

module.exports = app;