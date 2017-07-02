"use strict";

var mysql = require("mysql");
var dateFormat = require("dateformat");
var TCurso = require('../Negocio/TCurso');
var THorario = require('../Negocio/THorario');

/** @constructor Constructora del Objeto DAO del Módulo Curso
 * 
 * @param {String} host Host BBDD
 * @param {String} usuario Usuario de conexion a la BBDD
 * @param {String} password Contraseña de conexion a la BBDD
 * @param {String} nombreBD Nombre de la BBDD
 * 
 * @returns {nm$_DAOCurso.DAOCurso}
 */
function DAOCurso(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}

/** Crea una conexion con la BBDD usando los datos inicializados en la constructora del objeto
 * 
 * @returns {Connection} Objeto conexion a la BBDD
 */
DAOCurso.prototype.crearConexion = function () {
    return mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
};

//========================================================
//--------------------------CRUD--------------------------
//========================================================

/** Insertar un curso en la BBDD
 * 
 * @param {Curso} Objeto de tipo Curso para introducir en la BBDD
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {id} ID del curso introducido en la BBDD
 */
DAOCurso.prototype.insertarCurso = function(cursoNuevo, callback) {
    if (callback === undefined)
        callback = function() {};

    var conexion = this.crearConexion();

    conexion.connect(function(err) {
        if (err) {
            //Error a la hora de conectar con la BBDD
            callback(new Error(err), undefined);
        } else {
            
            var fecha_ini = dateFormat(cursoNuevo.fecha_ini, "yyyy-mm-dd");
            var fecha_fin = dateFormat(cursoNuevo.fecha_fin, "yyyy-mm-dd");

            var sql = "INSERT INTO cursos(titulo, descripcion, localidad, direccion, plazas_disp, fecha_ini, fecha_fin)" +
                    "VALUES (?,?,?,?,?,?,?)";

            var params = [cursoNuevo.titulo, cursoNuevo.descripcion, cursoNuevo.localidad, cursoNuevo.direccion, cursoNuevo.plazas_disp, fecha_ini, fecha_fin];
            conexion.query(sql, params , function (err, resultado) {
                if (err) {
                    //Error a la hora de ejecutar la query
                    callback(new Error("Error al insertar un curso."), undefined);
                } else {
                    //Ahora, siempre y cuando existan horarios, introducimos los horarios.
                    var mis_values =  [];
                    params = []
                    cursoNuevo.horarios.forEach(function(horario){
                        mis_values.push("(?,?,?,?)");
                        params.push(resultado.insertId,horario.hora_inicio,horario.hora_fin,horario.dia_semana);
                    });

                    if (params.length>0) {
                        sql = "INSERT INTO horarios(id_curso, hora_inicio, hora_fin, dia_semana) VALUES " + mis_values;

                        conexion.query(sql, params , function (err, resultado_2) {
                            conexion.end();
                            if (err) {
                                //Error a la hora de ejecutar la query
                                callback(new Error("Error al insertar un curso."), undefined);
                            } else {
                                callback(null, resultado.insertId);
                            }
                        });
                    } else {
                        callback(null, resultado.insertId);
                    }
                    
                }
            });
        }
    });
};

/** Buscar un curso en la BBDD
 * 
 * @param {ID} ID del curso que queremos
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {Curso} Curso buscado por ID con los datos de la BBDD 
 *                    undefined si no se encuentra en la BBDD 
 */
DAOCurso.prototype.buscarCursoByID = function(id, callback) {
    if (callback === undefined)
        callback = function () {};

    var conexion = this.crearConexion();

    conexion.connect(function (err) {
        if (err) {
            //Error a la hora de conectar con la BBDD
            callback(new Error(err), undefined);
        } else {
            var sql = "SELECT * FROM cursos WHERE id = ?";
            var params = [id];
            
            conexion.query(sql, params, function (err, rows) {
                if (err) {
                    //Error al ejecutar la query
                    callback(new Error("Error al buscar curso: " + err), undefined);
                } else {
                    if (rows.length>0) {
                        //Realizamos la busqueda de los horarios
                        sql = "SELECT * FROM horarios WHERE id_curso = ?";
                        conexion.query(sql, params, function (err, rows_2) {
                            conexion.end();
                            if (err) {
                                //Error al ejecutar la query
                                callback(new Error("Error al buscar curso: " + err), undefined);
                            } else {
                                var mis_horarios = [];
                                rows_2.forEach(function (h){
                                   mis_horarios.push(new THorario(h.id, h.id_curso, h.hora_inicio.substring(0, 5), h.hora_fin.substring(0, 5), h.dia_semana));
                                });
                                var cursoEncontrado = new TCurso(rows[0].id, 
                                                                rows[0].titulo, 
                                                                rows[0].descripcion, 
                                                                rows[0].localidad, 
                                                                rows[0].direccion, 
                                                                rows[0].plazas_disp, 
                                                                dateFormat(rows[0].fecha_ini, "dd-mm-yyyy"), 
                                                                dateFormat(rows[0].fecha_fin, "dd-mm-yyyy"), 
                                                                undefined, 
                                                                mis_horarios);
                                callback(null, cursoEncontrado);
                            }
                        });
                    }
                    else {
                        callback(null, undefined);
                    }
                }
            });
        }
    });
};

/** Buscar un curso en la BBDD
 * 
 * @param {name} Nombre que queremos que contenga en el titulo
 * @param {limite} Cantidad de cursos recuperamos de la BBDD
 * @param {posicion} Desde que posición recuperamos.
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {Curso} Curso buscado por ID con los datos de la BBDD 
 *                    undefined si no se encuentra en la BBDD 
 */
DAOCurso.prototype.buscarCursoByName = function(name, limite, posicion, callback) {
    if (callback === undefined)
        callback = function () {};

    var conexion = this.crearConexion();

    conexion.connect(function (err) {
        if (err) {
            //Error a la hora de conectar con la BBDD
            callback(new Error(err), undefined);
        } else {
            var sql = "SELECT * FROM cursos WHERE titulo like ? ORDER BY fecha_ini ASC LIMIT ? OFFSET ?";
            var params = ["%"+name+"%", limite, posicion-1];
            
            conexion.query(sql, params, function (err, rows) {
                conexion.end();
                if (err) {
                    //Error al ejecutar la query
                    callback(new Error("Error al buscar curso: " + err), undefined);
                } else {
                    if (rows.length>0){
                        var cursos = rows.map(function(c) {
                            return new TCurso(c.id, c.titulo, c.descripcion, c.localidad, c.direccion, 
                                c.plazas_disp, dateFormat(c.fecha_ini, "dd/mm/yyyy"), dateFormat(c.fecha_fin, "dd/mm/yyyy"), null, undefined);
                        });
                        callback(null, cursos);
                    }
                    else {
                        callback(null, undefined);

                    }
                }
            });
        }
    });
};

/** Buscar total de cursos en la BBDD
 * 
 * @param {name} Nombre que queremos que contenga en el titulo
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {Number} Total de cursos en la BBDD.
 */
DAOCurso.prototype.buscarCursoByNameTotal = function(name, callback) {
    if (callback === undefined)
        callback = function () {};

    var conexion = this.crearConexion();

    conexion.connect(function (err) {
        if (err) {
            //Error a la hora de conectar con la BBDD
            callback(new Error(err), undefined);
        } else {
            var sql = "SELECT * FROM cursos WHERE titulo like ?";
            var params = ["%"+name+"%"];
            conexion.query(sql, params, function (err, rows) {
                conexion.end();
                if (err) {
                    //Error al ejecutar la query
                    callback(new Error("Error al buscar curso: " + err), undefined);
                } else {
                    if (rows.length>0){
                        callback(null, rows.length);
                    }
                    else {
                        callback(null, undefined);
                    }
                }
            });
        }
    });
};



/** Modificar un curso en la BBDD
 * 
 * @param {Curso} Objeto de tipo Curso modificado en la BBDD
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {Boolean} true si se ha modificado con éxito, false si error.
 */
DAOCurso.prototype.modificarCurso = function(cursoModi, callback) {
    if (callback === undefined)
        callback = function() {};

    var conexion = this.crearConexion();

    //1- Eliminamos los horarios que pueda tener.
    conexion.connect(function(err){
        if (err) {
            //Error a la hora de conectar con la BBDD
            callback(new Error(err), false);
        } else {
            var sql = "DELETE FROM horarios WHERE id_curso = ?";

            var params = [cursoModi.id];

            conexion.query(sql, params, function(err, exitoBorrado){
                if (err) {
                    callback(new Error(err), false);
                } else {
                    sql = "UPDATE cursos SET titulo = ?, " +
                                    "descripcion = ?, " +
                                    "localidad = ?, " +
                                    "direccion = ?," +
                                    "plazas_disp = ?," +
                                    "fecha_ini = ?," + 
                                    "fecha_fin = ? " + 
                                    "WHERE id=?";

                    var fecha_ini = dateFormat(cursoModi.fecha_ini, "yyyy-mm-dd");
                    var fecha_fin = dateFormat(cursoModi.fecha_fin, "yyyy-mm-dd");
                    params = [cursoModi.titulo, cursoModi.descripcion, cursoModi.localidad, cursoModi.direccion,
                                    cursoModi.plazas_disp, fecha_ini, fecha_fin, cursoModi.id];
                    conexion.query(sql, params, function(err, resultado) {
                        if (err) {
                            //Error a la hora de ejecutar la query
                            callback(new Error("Error al modificar un curso: " + err), false);
                        } else {
                            //Ahora, siempre y cuando existan horarios, introducimos los horarios.
                            var mis_values =  [];
                            params = []
                            cursoModi.horarios.forEach(function(horario){
                                mis_values.push("(?,?,?,?)");
                                params.push(cursoModi.id,horario.hora_inicio,horario.hora_fin,horario.dia_semana);
                            });

                            if (params.length>0){
                                sql = "INSERT INTO horarios(id_curso, hora_inicio, hora_fin, dia_semana) VALUES " + mis_values;
                                console.log("Llego _ 1");
                                conexion.query(sql, params , function (err, resultado_2) {
                                    conexion.end();
                                    console.log("Llego _ 2");
                                    if (err) {
                                        //Error a la hora de ejecutar la query
                                        console.log("Llego _ error:" + err.message);
                                        callback(new Error("Error al modificar horarios."), undefined);
                                    } else {
                                        console.log("Llego _ 3");
                                        callback(null, true);
                                    }
                                });
                            }
                            else {
                                callback(null, true);
                            }
                        }
                    });
                }
            });
        }
    });
}

/** Eliminar un curso en la BBDD
 * 
 * @param {ID} ID del curso a eliminar.
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {Boolean} true si se ha eliminado con éxito, false si error.
 */
DAOCurso.prototype.eliminarCurso = function(id, callback) {
    if (callback === undefined)
        callback = function() {};

    var conexion = this.crearConexion();

    conexion.connect(function(err) {
        if (err) {
            //Error a la hora de conectar con la BBDD
            callback(new Error(err), false);
        } else {
            var sql = "DELETE FROM cursos WHERE id = ?";

            var params = [id];

            conexion.query(sql, params, function(err, resultado) {
                conexion.end();
                if (err) {
                    //Error a la hora de ejecutar la query
                    callback(new Error("Error al eliminar el curso solicitado: " + err), false);
                } else {
                    callback(null, true);
                }
            });
        }
    });
}

/** Vacantes de un curso.
 * 
 * @param {ID} ID del curso.
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {Number} Número de vacantes de un curso dado.
 */
DAOCurso.prototype.vacantesCurso = function(id, callback) {
    if (callback === undefined)
        callback = function() {};

    var conexion = this.crearConexion();

    conexion.connect(function(err) {
        if (err) {
            //Error a la hora de conectar con la BBDD
            callback(new Error(err), false);
        } else {
            var sql = "SELECT count(id) as inscritos FROM inscripciones WHERE id_curso = ?";

            var params = [id];

            conexion.query(sql, params, function(err, resultado) {
                conexion.end();
                if (err) {
                    //Error a la hora de ejecutar la query
                    callback(new Error("Error al buscar las vacantes de un curso solicitado: " + err), false);
                } else {
                    callback(null, resultado[0].inscritos);
                }
            });
        }
    });
}

//========================================================
//------------------------IMAGENES------------------------
//========================================================
/** Eliminar un curso en la BBDD
 * 
 * @param {ID} ID del curso a eliminar.
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {Boolean} true si se ha eliminado con éxito, false si error.
 */
DAOCurso.prototype.subirImagen = function(cursoImg, callback) {
    if (callback === undefined)
        callback = function() {};

    var conexion = this.crearConexion();

    conexion.connect(function(err) {
        if (err) {
            //Error a la hora de conectar con la BBDD
            callback(new Error(err), false);
        } else {
            var sql = "UPDATE cursos SET imagen = ? WHERE id = ?";
            
            var params = [cursoImg.imagen, cursoImg.id];

            conexion.query(sql, params, function(err, resultado) {
                conexion.end();
                if (err) {
                    //Error a la hora de ejecutar la query
                    callback(new Error("Error al subir la imagen al curso solicitado: " + err), false);
                } else {
                     if (resultado.affectedRows === 0) {
                        callback(new Error("No existe el curso para insertar la imagen", undefined));
                    } else {
                        callback(null, true);
                    }
                }
            });
        }
    });
}

/**
 * 
 * @param {type} nick
 * @param {type} callback
 * @returns {undefined}
 */
DAOCurso.prototype.buscarImagenCursoByID = function (id, callback) {
    if (callback === undefined)
        callback = function () {};

    var conexion = this.crearConexion();

    conexion.connect(function (err) {
        if (err) {
            callback(err);
        } else {
            var sql = "SELECT imagen FROM cursos WHERE id = ?";
            var params = [id];
            conexion.query(sql, params, function (err, result) {
                conexion.end();

                if (err) {
                    callback(err);
                } else {
                    
                    if (result.length === 0) {
                        callback(null, undefined);
                    } else {
                        callback(null, result[0].imagen);
                    }
                }
            });
        }
    });
};



module.exports = DAOCurso;
