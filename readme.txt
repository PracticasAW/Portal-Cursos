DOCUMENTACIÓN NECESARIA PARA REALIZAR LAS PRUEBAS CON LA API REST:
******************************************************************

-> INSERTAR CURSO:
	Tipo: POST,
	Content type: application/json,
	url: https://localhost:5555/cursos/insertarCurso,
	Body:
		{
			"titulo": "Curso nuevo",
			"descripcion": "Descripcion curso nuevo",
			"localidad": "localidad nueva",
			"direccion": "direccion nueva",
			"plazas_disp": "10",
			"fecha_inicio": "2017-01-24",
			"fecha_fin": "2017-01-25",
			"horarios":[
				{
					"hora_inicio": "10:00",
					"hora_fin": "11_00",
					"dia_semana": "viernes"
				},
				{
					"hora_inicio": "12:00",
					"hora_fin": "13_00",
					"dia_semana": "jueves"
				},
				{
					"hora_inicio": "15:00",
					"hora_fin": "17_00",
					"dia_semana": "martes"
				}
			]
		},
	respuesta:
		{
		  "respuesta": "Correcto",
		  "id": 5
		}


-*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*-

-> MODIFICAR CURSO:
	Tipo: PUT,
	Content type: application/json,
	url: https://localhost:5555/cursos/modificarCurso/[num_curso_a_modificar]
	Body:
		{
			"titulo": "curso prueba",
			"descripcion": "descripción prueba",
			"localidad": "localidad prueba",
			"direccion": "direccion prueba",
			"plazas_disp": "10",
			"fecha_inicio": "2017-01-24",
			"fecha_fin": "2017-01-25",
			"horarios":[
				{
					"hora_inicio": "10:00",
					"hora_fin": "11_00",
					"dia_semana": "martes"
				},
				{
					"hora_inicio": "12:00",
					"hora_fin": "13_00",
					"dia_semana": "miercoles"
				},
				{
					"hora_inicio": "15:00",
					"hora_fin": "17_00",
					"dia_semana": "viernes"
				}
			]
			
		},
	respuesta:
		{
			"respuesta": true
		}

-*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*-

-> ELIMINACIÓN CURSO:
	Tipo: DELETE,
	Content type: application/json,
	url: https://localhost:5555/cursos/eliminarCurso/[num_curso_a_modificar],
	respuesta:
		{
			"respuesta": true
		}

-*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*-

-> SUBIR IMAGEN CURSO:
	Tipo: PUT,
	Content type: EMPTY (importantísimo),
	url: https://localhost:5555/cursos/subirImagenCurso/[num_curso_a_modificar]
	Form Data:
		"foto": file seleccionado (no seleccionar tipo text).
		,
	respuesta:
		{
			subida
		}