require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.post('/usuario', (req,res) => {
  let body = req.body;
  res.send({
    body
  });
});

app.get('/', (req,res) => {
  res.json("Perro");
});

app.listen(process.env.PORT, () => {
  console.log("Escuchando puerco: ", process.env.PORT);
});

//POST AGREGAR
//PUT ACTUALIZAR
