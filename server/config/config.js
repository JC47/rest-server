// ================================================
// Puerto
// ================================================

process.env.PORT = process.env.PORT || 3000;

// ================================================
// Puerto
// ================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================================
// DB
// ================================================
let urlDB;

if(process.env.NODE_ENV === "dev"){
  urlDB = "mongodb://localhost:27017/cafe";
}
else{
  urlDB = "mongodb://cafe-user:cacj961128@ds149593.mlab.com:49593/cafe";
}

process.env.URLDB = urlDB;
