const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req,res) => {

  let email = req.body.email;
  let pass = req.body.password;

  Usuario.findOne({email}, (err, usuarioDB) => {
    if(err != null) {
      return res.status(400).json({
        ok:false,
        err
      });
    }

    if(!usuarioDB){
      return res.status(500).json({
        ok:false,
        err: "El (usuario) o contraseña incorrectos"
      });
    }

    if(!bcrypt.compareSync(pass,usuarioDB.password)){
      return res.status(500).json({
        ok:false,
        err: "El usuario o (contraseña) incorrectos"
      });
    }
    
    let token = jwt.sign({
      usuario:usuarioDB,
    },process.env.SEED, {expiresIn:process.env.CADUCIDAD_TOKEN});

    res.json({
      ok:true,
      usuario: usuarioDB,
      token
    });

  });
});

module.exports = app;
