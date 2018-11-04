const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.post('/usuario', (req,res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err,Usuariodb) => {

    if(err != null) {
      return res.status(400).json({
        ok:false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: Usuariodb
    });
  });
});

app.put('/usuario/:id', (req,res) => {
  let id = req.params.id;
  let body = _.pick(req.body,["nombre","email","img","role","estado"]);

  Usuario.findOneAndUpdate(id, body, {new:true, runValidators:true} ,(err,usuarioDB) => {
    if(err != null) {
      return res.status(400).json({
        ok:false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});

app.get('/usuario', (req,res) => {

  let desde = Number(req.query.desde) || 0;
  let hasta = Number(req.query.limite) || 9;

  Usuario.find({estado:true},'nombre email role estado google img')
          .skip(desde)
          .limit(hasta)
          .exec((err,usuarios) => {
            if(err != null) {
              return res.status(400).json({
                ok:false,
                err
              });
            }

            Usuario.countDocuments({estado:true}, (err, conteo) => {
              res.json({
                ok:true,
                usuarios,
                total:conteo
              });
            })


          });
});

app.get('/', (req,res) => {
  res.json("Perro");
});

app.delete('/usuario/:id', (req,res) => {
  let id = req.params.id;
  // Usuario.findOneAndRemove({_id:id}, (err, usuarioX) => {
  //   if(err != null) {
  //     return res.status(400).json({
  //       ok:false,
  //       err
  //     });
  //   }
  //
  //   if(!usuarioX){
  //     return res.status(400).json({
  //       ok:false,
  //       err:"Usuario no encontrado"
  //     });
  //   }
  //
  //   res.json({
  //     ok:true,
  //     usuario: usuarioX
  //   });
  // })

  Usuario.findOneAndUpdate({_id:id}, {estado:false}, {new:true, runValidators:true} ,(err,usuarioDB) => {
    if(err != null) {
      return res.status(400).json({
        ok:false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
})

module.exports = app;
