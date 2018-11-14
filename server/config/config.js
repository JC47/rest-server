// ================================================
// Puerto
// ================================================

process.env.PORT = process.env.PORT || 3000;

// ================================================
// Puerto
// ================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================================
// Vencimiento del token
// ================================================
process.env.CADUCIDAD_TOKEN = 60*60*24*30;

// ================================================
// Semilla
// ================================================
process.env.SEED = process.env.SEED || 'este-es-el-seed';

// ================================================
// DB
// ================================================
let urlDB;

if(process.env.NODE_ENV === "dev"){
  urlDB = "mongodb://localhost:27017/cafe";
}
else{
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ================================================
// Google CLIENT_ID
// ================================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '842447740012-qcsrufkjdn876qvhcbkb7qbki8ui74v0.apps.googleusercontent.com';
