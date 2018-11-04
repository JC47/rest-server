require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex:true }, (err,res) => {
  if(err) throw err;

  console.log("DB online");
});

app.listen(process.env.PORT, () => {
  console.log("Escuchando puerco: ", process.env.PORT);
});

//POST AGREGAR
//PUT ACTUALIZAR
