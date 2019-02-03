const express = require('express');
const _ = require('underscore');
const {verificaToken} = require('../middlewares/auth');
const Producto = require('../models/producto');

let app = express();

app.get('/producto', [verificaToken], (req,res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible:true})
    .skip(desde)
    .limit(5)
    .sort('nombre')
    .populate('usuario','nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
        if(err != null){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            productos
        });
    });
});

app.get('/producto/buscar/:termino', [verificaToken], (req,res) => {

    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i');

    Producto.find({nombre: regexp})
    .populate('usuario','nombre email')
    .populate('categoria', 'descripcion')
    .exec((err,productos) => {
        if (err != null) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });
    })
});

app.get('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    Producto.findOne({_id:id})
    .populate('usuario','nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, producto) => {
        if (err != null) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});

app.post('/producto', [verificaToken], (req,res) => {
    let descripcion = req.body.descripcion;
    let nombre = req.body.nombre;
    let precioUni = req.body.precioUni;
    let categoria = req.body.categoria;
    let usuario = req.usuario._id;

    let producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        categoria,
        usuario
    });

    producto.save((err, prod) => {
        if(err != null){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            producto: prod
        });
    });
});

app.put('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "precioUni", "descripcion", "categoria", "usuario"]);

    Producto.findOneAndUpdate({_id:id}, body, {new: true, runValidators:true}, (err, producto) => {
        if (err != null) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});

app.delete('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id;

    Producto.findOneAndUpdate({_id:id}, {disponible:false}, {new:true, runValidators:true} ,(err) => {
    if(err != null) {
      return res.status(500).json({
        ok:false,
        err
      });
    }

    res.json({
      ok: true
    });
  });
});

module.exports = app;
