"use strict";
var FactDAO = require('../Integracion/FactoriaDAO');
var TUsuario = require('./TUsuario');
var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require("body-parser"); //Middleware que obtiene el cuerpo de la petición HTTP para interpretar su contenido.
var multer = require('multer'); //Modulo para subir ficheros 
var passport = require('passport');
var passportHTTP = require('passport-http');

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

/*==========
 Middleware
 ==========*/

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

/*==========
 CONFIG APP
 ==========*/

var miRouter = express.Router();

miRouter.use(bodyParser.json());

//Configuración para ficheros estáticos.
var ficherosEstaticos = path.join(__dirname, "../public");
miRouter.use(express.static(ficherosEstaticos));


//Configuración de multer (subida de ficheros)
var multerFactory = multer({storage: multer.memoryStorage()});

//Configuración de integracción.
var FactoriaDAO = new FactDAO();
var DAOUsuario = FactoriaDAO.creaDAOUsuario();

//Middleware para autenticarse.
miRouter.use(passport.initialize());

passport.use(new passportHTTP.BasicStrategy(
        { realm: 'Autenticacion' },
        function(user, pass, callback) {
            //Consultamos en la BBDD.
            var mi_usuario = new TUsuario(0, null, null, null, null, user, pass);
            DAOUsuario.login(mi_usuario, function(error, respuesta){
                if (respuesta){
                    if (user === respuesta.email && pass === respuesta.password) {
                        callback(null, { respuesta: respuesta });
                    } else {
                        callback(null, false);
                    }
                } else {
                    callback(null, false);
                }
            });
        }
));


//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

//*****************************************************************
//****************************USUARIOS*****************************
//*****************************************************************

// ======================
//       INSERCCIÓN
// ======================
/**
 * Función busqueda que dado un ID de curso nos devuelve toda su información (incluido sus horarios).
 */
miRouter.post("/insertUser", function(request, response) {
    var nombre = request.body.nombre;
    var apellidos = request.body.apellidos;
    var sexo = request.body.sexo;
    var fecha_nacimiento = request.body.fecha_nacimiento;
    var email = request.body.email;
    var password = request.body.password;

    //En este punto deberíamos validar todos los datos que nos entran.
    //Realizamos la consulta a la BBDD
    var mi_usuario = new TUsuario(0, nombre, apellidos, sexo, fecha_nacimiento, email, password);
    DAOUsuario.insertarUsuario(mi_usuario, function(error, respuesta) {
        if (error) {
            response.status(200);
            var respuesta = undefined;
        } else {
            var respuesta = {
                "respuesta" : "Correcto",
                "id": respuesta
            };  
        }
        response.json(respuesta);
    });
});

// ======================
//         LOGIN
// ======================

/**
 * Función que comprueba si un usuario pasa las credenciales correctas.
 */
miRouter.get("/login", passport.authenticate('basic', {session: false}), function(request, response) {
        response.json({datos: request.user.respuesta});
});

// =======================
//      INSCRIPCIONES
// =======================

/**
 * Función que inscribe a un usuario logeado en un curso establecido.
 */
miRouter.post("/inscribirUsuarioACurso", passport.authenticate('basic', {session: false}), function(request, response) {
    if (request.user.respuesta) {
        DAOUsuario.inscribirUsuario(request.body.id_curso, request.user.respuesta, function(error, respuesta){
            if (error) {
                response.json({respuesta: error.message});
            } else {
                response.json({respuesta: respuesta});
            }
        });
    } else {
        response.json({respuesta: undefined});
    }
});

/**
 * Función que nos devuelve en los cursos que está inscrito un usuario.
 */
miRouter.get("/cursosInscrito", passport.authenticate('basic', {session: false}), function(request, response){
    if (request.user.respuesta) {
        DAOUsuario.cursosInscrito(request.user.respuesta, function(error, respuesta){
            if (error) {
                response.json({respuesta: error.message});
            } else {
                response.json({respuesta: respuesta});
            }
        });
    } else {
        response.json({respuesta: undefined});   
    }
});

/**
 * Función que nos devuelve verdadero si un usuario está inscrito a un curso.
 */
miRouter.get("/estaInscrito", passport.authenticate('basic', {session: false}), function(request, response){
    var id_curso = request.query.id_curso;
    var id_usuario = request.query.id_usuario;
    if (request.user.respuesta) {
        DAOUsuario.estaInscrito(id_usuario, id_curso, function(error, respuesta){
            if (error) {
                response.json({respuesta: error.message});
            } else {
                response.json({respuesta: respuesta});
            }
        });
    } else {
        response.json({respuesta: undefined});   
    }
});


module.exports = miRouter;