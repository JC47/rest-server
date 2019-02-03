const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const speakeasy = require('speakeasy');

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

//COnfguraciones de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

app.post('/google', async(req,res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
                      .catch(e=>{
                        return res.status(403).json({
                          ok:false,
                          err:e
                        });
                      });

    Usuario.findOne({email: googleUser.email}, (err,usuarioDB) => {
        if(err){
          return res.status(500).json({
            ok:false,
            err
          });
        }

        if(usuarioDB){
          if(usuarioDB.google === false){
            return res.status(400).json({
              ok:false,
              err: "Debe de usar su auth normal"
            });
          }
          else{
            let token = jwt.sign({
              usuario:usuarioDB,
            },process.env.SEED, {expiresIn:process.env.CADUCIDAD_TOKEN});

            return res.json({
              ok:true,
              usuario: usuarioDB,
              token
            });
          }
        }
        else{
          let usuario = new Usuario();

          usuario.nombre = googleUser.nombre;
          usuario.email = googleUser.email;
          usuario.img = googleUser.img;
          usuario.google = true;
          usuario.password = ':)';

          usuario.save((err, usuarioDB) => {

            if(err){
              return res.status(500).json({
                ok:false,
                err
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
        }


    });
});

app.post('/auth', (req,res) => {
  let utoken = req.body.token;
  let secret = req.body.secret;

  let verified = speakeasy.totp.verify({
  secret: secret,
  encoding: 'base32',
  token: utoken
  });

  res.json({verified})
});


module.exports = app;
