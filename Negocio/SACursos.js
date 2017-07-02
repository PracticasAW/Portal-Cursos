"use strict";
var FactDAO = require('../Integracion/FactoriaDAO');
var TCurso = require('./TCurso');
var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require("body-parser"); //Middleware que obtiene el cuerpo de la petición HTTP para interpretar su contenido.
var multer = require('multer'); //Modulo para subir ficheros 
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
var DAOCurso = FactoriaDAO.creaDAOCurso();


//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

//*****************************************************************
//*****************************CURSOS******************************
//*****************************************************************

// ======================
//       BUSQUEDAS
// ======================
/**
 * Función busqueda que dado un ID de curso nos devuelve toda su información (incluido sus horarios).
 */
miRouter.get("/getinfobyid", function(request, response) {
    var id = request.query.id_curso;

    if (isNaN(id)) {
        console.log("Introduzca un parámetro válido");
        response.status(400);
        response.end();
    } else {
        id = Number(id);
        //Realizamos la consulta a la BBDD
        DAOCurso.buscarCursoByID(id, function(error, respuesta) {
            if (error) {
                response.status(200);
                var respuesta = undefined;
            } else {
                var respuesta = {
                    "respuesta": respuesta
                };  
            }
            response.json(respuesta);
        });
    }
});

/**
 * Función busqueda que dado un nombre de curso nos devuelve toda su información (incluido sus horarios).
 */
miRouter.get("/getinfobyname", function(request, response) {
    var name = request.query.nombre;
    var limite = request.query.limite;
    var posicion = request.query.posicion;
    
    //Ojo! No permitir que se introduzca una posición <= 0 porque no puede buscar en posiciones negativas. posicion - 1
    if (name === "" || name === undefined || isNaN(limite) || isNaN(posicion) || posicion<=0) {
        console.log("Introduzca un parámetro válido");
        response.status(400);
        response.end();
    } else {
        //Realizamos la consulta a la BBDD
        limite = Number(limite);
        posicion = Number(posicion);
        DAOCurso.buscarCursoByName(name, limite, posicion, function(error, respuesta) {
            if (error) {
                response.status(200);
                var respuesta = undefined;
            } else {
                var respuesta = {
                    "respuesta": respuesta
                };  
            }
            response.json(respuesta);
        });
    }
});

/**
 * Función busqueda que dado un nombre de curso nos devuelve el total de cursos encontrados.
 */
miRouter.get("/getinfobynametotal", function(request, response) {
    var name = request.query.nombre;
    
    //Ojo! No permitir que se introduzca una posición <= 0 porque no puede buscar en posiciones negativas. posicion - 1
    if (name === "" || name === undefined) {
        console.log("Introduzca un parámetro válido");
        response.status(400);
        response.end();
    } else {
        //Realizamos la consulta a la BBDD
        DAOCurso.buscarCursoByNameTotal(name, function(error, respuesta) {
            if (error) {
                response.status(200);
                var respuesta = undefined;
            } else {
                var respuesta = {
                    "respuesta": respuesta
                };  
            }
            response.json(respuesta);
        });
    }
});

/**
 * Función que nos devuelve el número de vacantes de un id curso establecido.
 */
miRouter.get("/vacantesCurso", function(request, response){
    var id_curso = request.query.id;
    
    //Ojo! No permitir que se introduzca una posición <= 0 porque no puede buscar en posiciones negativas. posicion - 1
    if (id_curso === "" || id_curso === undefined) {
        console.log("Introduzca un parámetro válido");
        response.status(400);
        response.end();
    } else {
        //Realizamos la consulta a la BBDD
        DAOCurso.vacantesCurso(id_curso, function(error, respuesta) {
            if (error) {
                response.status(200);
                var respuesta = undefined;
            } else {
                var respuesta = {
                    "respuesta": respuesta
                };  
            }
            response.json(respuesta);
        });
    }
});


// ======================
//       INSERCCIÓN
// ======================

/**
 * Función que inserta un curso nuevo en la base de datos.
 */
miRouter.post("/insertarCurso", function(request, response) {
    var titulo = request.body.titulo;
    var descripcion = request.body.descripcion;
    var localidad = request.body.localidad;
    var direccion = request.body.direccion;
    var plazas_disp = request.body.plazas_disp;
    var fecha_inicio = request.body.fecha_ini;
    var fecha_fin = request.body.fecha_fin;
    var horarios = request.body.horarios;


    //Validar que todos los datos estén correctos...
    var mi_curso = new TCurso(0,titulo, descripcion, localidad, direccion, plazas_disp, fecha_inicio, fecha_fin, undefined, horarios);
    DAOCurso.insertarCurso(mi_curso, function(error, respuesta) {
        if (error) {
            response.status(200);
            var respuesta = undefined;
        } else {
            var respuesta = {
                "respuesta" : "Correcto",
                "id": respuesta
            };
            response.json(respuesta);
        }
    });    
});

// ======================
//      MODIFICACIÓN
// ======================

/**
 * Función que modifica un curso nuevo en la base de datos.
 */
miRouter.put("/modificarCurso/:id", function(request, response) {
    var id = Number(request.params.id);
    var titulo = request.body.titulo;
    var descripcion = request.body.descripcion;
    var localidad = request.body.localidad;
    var direccion = request.body.direccion;
    var plazas_disp = request.body.plazas_disp;
    var fecha_inicio = request.body.fecha_ini;
    var fecha_fin = request.body.fecha_fin;
    var horarios = request.body.horarios;

    //Validar que todos los datos estén correctos...
    var mi_curso = new TCurso(id,titulo, descripcion, localidad, direccion, plazas_disp, fecha_inicio, fecha_fin, undefined, horarios);
    DAOCurso.modificarCurso(mi_curso, function(error, respuesta) {
        if (error) {
            response.status(200);
            var respuesta = undefined;
        } else {
            var respuesta = {
                "respuesta" : respuesta
            };
            response.json(respuesta);
        }
    });    
});

// ======================
//       ELIMINACIÓN
// ======================

/**
 * Función que modifica un curso nuevo en la base de datos.
 */
miRouter.delete("/eliminarCurso/:id", function(request, response) {
    var id = Number(request.params.id);

    //Validar que todos los datos estén correctos...
    DAOCurso.eliminarCurso(id, function(error, respuesta) {
        if (error) {
            response.status(200);
            var respuesta = undefined;
        } else {
            console.log("Respuesta para eliminar: " + respuesta);
            var respuesta = {
                "respuesta" : respuesta
            };
            response.json(respuesta);
        }
    });    
});

// ======================
//        IMÁGENES
// ======================

miRouter.put("/subirImagenCurso/:id", multerFactory.single("foto"), function(request, response){
    var id = Number(request.params.id);
    if(request.file){
        var foto = request.file.buffer;  
        var cursoNuevo = new TCurso(id, null, null, null, null, 0, null, null, foto, null);
        DAOCurso.subirImagen(cursoNuevo, function(error, respuesta) {
            if (error) {
                console.log("Error en BBDD: " + error.message);
                response.status(200);
                var respuesta = undefined;
            } else {
                console.log("Respuesta para subir una imagen: " + respuesta);
                var respuesta = {
                    "respuesta" : respuesta
                };
                response.end("Subida");
            }
        });
    } else {
        //Damos un error porque no encuentro nada en foto...
        response.end("No encuentro la foto");
    }
});

miRouter.get("/cogerImagen/:id", function (request, response) {

    var nombreFichero = "";
    var urlFichero = "";

    console.log("  Buscando imagen en BBDD...");
    
    console.log(":id --> " + request.params.id);
    DAOCurso.buscarCursoByID(request.params.id, function (err, curso) {
        if (err) {
            console.log("ERROR al buscar curso en la BBDD");
            console.log(err);
            //next(err);
        } else {

            if (curso === undefined) {
                console.log("curso no encontrado");
                response.status(404);
                response.end("Not found");
                
            }else{
                DAOCurso.buscarImagenCursoByID(curso.id, function (err, foto) {
                    if (err) {
                        console.log("ERROR al buscar foto en la BBDD");
                        console.log(err);
                        //next(err);
                    } else {
                        if (foto) {
                            var respuesta = {
                                "respuesta" : foto
                            };
                            response.end(foto);
                        } else {
                            
                            // if(usuario.sexo === "HOMBRE"){
                            //     nombreFichero = "login_hombre.png";
                            // }else{
                            //     nombreFichero = "login_mujer.png";
                            // }
                            
                            nombreFichero="login_hombre.png";
                            urlFichero = path.join("public/icon_login/", nombreFichero);

                            console.log("  Renderizando foto...");
                            console.log(urlFichero);

                            fs.readFile(urlFichero, function (err, contenido) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    response.end(contenido);
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});



module.exports = miRouter;