
"use strict";

/** Constructora de objeto Curso
 * 
 * @param {Number} id
 * @param {String} nombre
 * @param {String} apellidos
 * @param {String} sexo
 * @param {Date} fecha_nacimiento
 * @param {String} email
 * @param {String} password
 * 
 * @returns {TUsuario}
 */
function TUsuario(id, nombre, apellidos, sexo, fecha_nacimiento, email, password) {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.sexo = sexo;
    this.fecha_nacimiento = fecha_nacimiento;
    this.email = email;
    this.password = password;
}

module.exports = TUsuario;

