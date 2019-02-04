const jwt = require('jsonwebtoken');

// ==================
// Verificar token
// ==================

let verificaToken = (req,res,next) => {
  let token = req.get('Authorization');

  jwt.verify (token, process.env.SEED, (err, decoded) => {
    if(err){
      return res.status(401).json({
        ok:false,
        err
      });
    }

    req.usuario = decoded.usuario;

    next();
  });
};

// ==================
// Verificar token  admin
// ==================

let verificaTokenAdmin = (req,res,next) => {
  let usuario = req.usuario;
  if(usuario.role != "ADMIN_ROLE"){
    return res.status(401).json({
      ok:false,
      err:{msg:"Usuario no autorizado"}
    });
  }

  next();
};

let verificaTokenImg = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }

    req.usuario = decoded.usuario;

    next();
  });
}

module.exports = {
  verificaToken,
  verificaTokenAdmin,
  verificaTokenImg
}
