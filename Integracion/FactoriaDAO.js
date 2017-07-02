"use strict";
var DAOCurso = require("./DAOCurso");
var DAOUsuario = require("./DAOUsuario");
var config = require("../config");


/** @constructor Constructor de la Factoria de DAOs
 * 
 * @returns {nm$_FactoriaDAO.FactoriaDAO}
 */
function FactoriaDAO() {
    this.host = config.host;    
    this.usuario = config.usuario;
    this.password = config.password;
    this.nombreBD = config.nombreBD;
}

/** Crea y retorna una DAO del Módulo Curso
 * 
 * @returns {nm$_FactoriaDAO.DAOUsuario} DAO del Módulo Usuarios
 */
FactoriaDAO.prototype.creaDAOCurso = function() {
  return new DAOCurso(this.host, this.usuario, this.password, this.nombreBD); 
};

FactoriaDAO.prototype.creaDAOUsuario = function() {
  return new DAOUsuario(this.host, this.usuario, this.password, this.nombreBD); 
};

module.exports = FactoriaDAO;