
"use strict";

/** Constructora de objeto Horario
 * 
 * @param {Number} id
 * @param {Number} id_curso
 * @param {Time} hora_inicio
 * @param {Time} hora_fin
 * @param {String} dia_semana
 * 
 * @returns {Horario}
 */
function Horario(id, id_curso, hora_inicio, hora_fin, dia_semana) {
    this.id = id;
    this.id_curso = id_curso;
    this.hora_inicio = hora_inicio;
    this.hora_fin = hora_fin;
    this.dia_semana = dia_semana;
}

module.exports = Horario;

