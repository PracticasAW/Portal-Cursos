/* global __dirname */

"use strict";

var express = require('express');
var https = require("https")
var app = express(); //Llamamos a express() cuando queremos una app nueva.
var morgan = require("morgan"); //Morgan nos muestra las peticiones por consola.
var path = require('path');
var fs = require("fs");
var config = require("./config.js");

app.use(morgan("dev"));
//Configuración para ficheros estáticos.
var ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

//Configuración de routers.
var Router_Cursos = require("./negocio/SACursos");
app.use("/cursos", Router_Cursos);
var Router_Usuarios = require("./negocio/SAUsuarios");
app.use("/usuarios", Router_Usuarios);

//Arrancamos el servidor.
/*app.listen(3000, function() {
    console.log("Servidor arrancado en el puerto 3000");
});*/

var clavePrivada = fs.readFileSync(config.private_key);
var certificado = fs.readFileSync(config.certificate);

var servidor = https.createServer(
	{ key: clavePrivada, cert: certificado }, app);

servidor.listen(config.port, function(err) {
	console.log("Servidor arrancado en el puerto: " + config.port);
})

