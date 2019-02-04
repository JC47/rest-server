const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(fileUpload());

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: "No hay archivo"
        });
    }

    let validtypes = ['productos','usuarios']
    if(validtypes.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: "Tipo no valido"
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let partes = archivo.name.split('.');
    let extention = partes[partes.length-1];

    let extentions = ['png','jpg','gif','jpeg'];

    if(extentions.indexOf(extention) < 0){
        return res.status(400).json({
            ok: false,
            err: "Extensión no valida"
        });
    }

    let nombreReal = `${id}-${new Date().getMilliseconds()}.${extention}`;



    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreReal}`, function (err) {
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreReal);
        }
        else{
            imagenProducto(id, res, nombreReal);
        }
        
    }); 
    
});

function imagenUsuario(id, res, nombre){
    Usuario.findOne({_id:id}, (err, usuario) => {
        if(err){
            borraRepetida('usuario',nombre);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if(!usuario){
            borraRepetida('usuario',nombre);
            return res.status(500).json({
                ok: false,
                err: "No existe el usuario"
            });
        }

        borraRepetida('usuarios',usuario.img);
        
        usuario.img = nombre;

        usuario.save((err, usuario2) => {
            res.json({
                ok:true,
                usuario: usuario2
            });
        });
        
    });
}

function imagenProducto(id, res, nombre){
    Producto.findOne({_id:id}, (err, producto) => {
        if(err){
            borraRepetida('productos',nombre);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if(!producto){
            borraRepetida('productos',nombre);
            return res.status(500).json({
                ok: false,
                err: "No existe el producto"
            });
        }

        borraRepetida('productos',producto.img);
        
        producto.img = nombre;

        producto.save((err, producto2) => {
            res.json({
                ok:true,
                producto: producto2
            });
        });
        
    });
}

function borraRepetida(tipo,img){
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;