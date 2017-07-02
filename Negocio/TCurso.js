
"use strict";

/** Constructora de objeto Curso
 * 
 * @param {Number} id
 * @param {String} titulo
 * @param {String} descripcion
 * @param {Number} plazas_disp
 * @param {Date} fecha_ini
 * @param {Date} fecha_fin
 * @param {String} imagen
 * 
 * @returns {Curso}
 */
function Curso(id, titulo, descripcion, localidad, direccion, plazas_disp, fecha_ini, fecha_fin, imagen, horarios) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.localidad = localidad;
    this.direccion = direccion;
    this.plazas_disp = plazas_disp;
    this.fecha_ini = fecha_ini;
    this.fecha_fin = fecha_fin;
    this.imagen = imagen;
    if(horarios === undefined) this.horarios = []; else  this.horarios = horarios;
}

module.exports = Curso;

