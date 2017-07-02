"use strict";

var mysql = require("mysql");
var dateFormat = require("dateformat");
var TCurso = require('../Negocio/TCurso');
var THorario = require('../Negocio/THorario');

/** @constructor Constructora del Objeto DAO del Módulo Usuario
 * 
 * @param {String} host Host BBDD
 * @param {String} usuario Usuario de conexion a la BBDD
 * @param {String} password Contraseña de conexion a la BBDD
 * @param {String} nombreBD Nombre de la BBDD
 * 
 * @returns {nm$_DAOUsuario.DAOUsuario}
 */
function DAOUsuario(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}

/** Crea una conexion con la BBDD usando los datos inicializados en la constructora del objeto
 * 
 * @returns {Connection} Objeto conexion a la BBDD
 */
DAOUsuario.prototype.crearConexion = function () {
    return mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
};

//========================================================
//--------------------------FUNCIONES---------------------
//========================================================

/** Insertar un usuario en la BBDD
 * 
 * @param {TUsuario} Objeto de tipo TUsuario para introducir en la BBDD
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {id} ID del usuario introducido en la BBDD
 */
DAOUsuario.prototype.insertarUsuario = function(usuarioNuevo, callback) {
    if (callback === undefined)
        callback = function() {};

    var conexion = this.crearConexion();

    conexion.connect(function(err) {
        if (err) {
            //Error a la hora de conectar con la BBDD
            callback(new Error(err), undefined);
        } else {
            
            var fecha_nacimiento = dateFormat(usuarioNuevo.fecha_nacimiento, "yyyy-mm-dd");

            var sql = "INSERT INTO usuarios(nombre, apellidos, sexo, fecha_nac, email, password)" +
                    "VALUES (?,?,?,?,?,?)";

            var params = [usuarioNuevo.nombre, usuarioNuevo.apellidos, usuarioNuevo.sexo, fecha_nacimiento, usuarioNuevo.email, usuarioNuevo.password];
            conexion.query(sql, params , function (err, resultado) {
                conexion.end();
                if (err) {
                    //Error a la hora de ejecutar la query
                    callback(new Error("Error al insertar un usuario." + " - " + err), undefined);
                } else {
                    callback(null, resultado.insertId);
                }
            });
        }
    });
};

/** login usuario
 * 
 * @param {TUsuario} Objeto de tipo TUsuario para introducir en la BBDD
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {TUsuario} Devuelve el usuario relleno si se encuentra. undefined si no se encuentra nada o error.
 */
DAOUsuario.prototype.login = function(usuarioLogin, callback){
    if (callback === undefined)
        callback = function(){};

    var conexion = this.crearConexion();

    conexion.connect(function(err){
        if (err){
            callback(new Error(err), undefined);
        } else {

            var sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

            var params = [usuarioLogin.email, usuarioLogin.password];

            conexion.query(sql, params, function(err, resultado){
                conexion.end();
                if (err) {
                    //Error a la hora de ejecutar la query
                    callback(new Error("Error al insertar un usuario."), undefined);
                } else {
                    if (resultado.length > 0) {
                        callback(null, resultado[0]);
                    } else {
                        callback(null, undefined);
                    }
                }
            });
        }
    });
}

/** inscribir usuario en un curso
 *
 * @param {Number} Identificador del curso al que se desea inscribir el usuario.
 * @param {TUsuario} Objeto de tipo TUsuario para introducir en la BBDD.
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {Number} Devuelve el id otorgado a la inscripción en caso de éxito, undefined en caso de error.
 */
DAOUsuario.prototype.inscribirUsuario = function(id_curso, usuario, callback){
    if (callback === undefined)
        callback = function(){};

    var conexion = this.crearConexion();

    conexion.connect(function(err){
        if (err){
            callback(new Error(err), undefined);
        } else {

            var sql = "INSERT INTO inscripciones(id_curso,id_usuario) VALUES(?,?)";

            var params = params = [id_curso,usuario.id];

            conexion.query(sql, params, function(err, resultado){
                conexion.end();
                if (err) {
                    callback(new Error("Error al inscribirse en un curso" + err), undefined);
                } else {
                    callback(null, resultado.insertId);
                }
            });
        }
    });
}

/** consultar cursos inscrito de usuario
 *
 * @param {TUsuario} Objeto de tipo TUsuario con la información del usuario.
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {TCurso} Devuelve un array de objetos de tipo TCurso con los cursos y las fechas asociadas.
 */
DAOUsuario.prototype.cursosInscrito = function(usuario, callback){
    if (callback === undefined)
        callback = function(){};

    var conexion = this.crearConexion();

    conexion.connect(function(err){
        if (err){
            callback(new Error(err), undefined);
        } else {

            var sql = "SELECT c.id, c.titulo, c.localidad, c.fecha_ini, c.fecha_fin, h.id as id_horario, h.hora_inicio, h.hora_fin, h.dia_semana FROM usuarios u "
                    +"JOIN inscripciones i on u.id=i.id_usuario JOIN cursos c " 
                    +"on c.id=i.id_curso JOIN horarios h on c.id=h.id_curso WHERE u.id=?";

            var params = params = [usuario.id];

            conexion.query(sql, params, function(err, resultado){
                conexion.end();
                if (err) {
                    callback(new Error("Error al buscar los horarios" + err), undefined);
                } else {
                    if (resultado.length > 0) {
                        var id_curso_actual = -1;
                        var mis_cursos = [];
                        var posicion = -1;
                        resultado.forEach(function(curso){
                            if (curso.id !== id_curso_actual) {
                                id_curso_actual = curso.id;
                                mis_cursos.push(new TCurso(curso.id, curso.titulo, undefined, curso.localidad, undefined, undefined, 
                                dateFormat(curso.fecha_ini,'dd-mm-yyyy'), dateFormat(curso.fecha_fin,'dd-mm-yyyy'), null, 
                                [new THorario(curso.id_horario, curso.id, curso.hora_inicio.substring(0, 5), 
                                    curso.hora_fin.substring(0, 5), curso.dia_semana)]));
                                posicion++;
                            } else {
                                mis_cursos[posicion].horarios.push(new THorario(curso.id_horario, curso.id, curso.hora_inicio.substring(0, 5), 
                                    curso.hora_fin.substring(0, 5), curso.dia_semana));
                            }

                        });
                        callback(null, mis_cursos);
                    } else {
                        callback(null, undefined);
                    }
                }
            });
        }
    });
}

/** Comprobación de si un usuario está inscrito en un curso
 *
 * @param {Number} Id de usuario
 * @param {Number} Id de curso
 * @param {function} callback Función callBack para el retorno del resultado.
 * 
 * @returns {Boolean} Devuelve un true si está inscrito, false si no lo está y undefined si no se encuentra.
 */
DAOUsuario.prototype.estaInscrito = function(id_usuario, id_curso, callback){
    if (callback === undefined)
        callback = function(){};

    var conexion = this.crearConexion();

    conexion.connect(function(err){
        if (err){
            callback(new Error(err), undefined);
        } else {

            var sql = "SELECT * FROM inscripciones WHERE id_usuario = ? AND id_curso = ?";

            var params = params = [id_usuario, id_curso];

            conexion.query(sql, params, function(err, resultado){
                conexion.end();
                if (err) {
                    callback(new Error("Error al comprobar si un usuario está inscrito en un curso" + err), undefined);
                } else {
                    if (resultado.length > 0) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                }
            });
        }
    });
}


module.exports = DAOUsuario;
