const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaTokenAdmin } = require('../middlewares/auth');

let app = express();

let Categoria = require('../models/categoria');


app.get('/categoria', [verificaToken], (req,res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err, categorias) => {
        if(err != null){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categorias
        });
    });
});

app.get('/categoria/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    Categoria.findOne({_id:id}).exec((err, categoria) => {
        if (err != null) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

app.post('/categoria', [verificaToken], (req,res) => {
    let descripcion = req.body.descripcion;
    let usuario = req.usuario._id;

    let categoria = new Categoria({
        descripcion,
        usuario
    });

    categoria.save((err, cat) => {
        if(err != null){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: cat
        });
    });
});

app.put('/categoria/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["descripcion"]);

    Categoria.findOneAndUpdate({_id:id}, body, {new: true, runValidators:true}, (err, categoria) => {
        if (err != null) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

app.delete('/categoria/:id', [verificaToken, verificaTokenAdmin], (req, res) => {
    let id = req.params.id;

    Categoria.findOneAndRemove({_id:id}, (err) => {
        if (err != null) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true
        });
    });
});



module.exports = app;