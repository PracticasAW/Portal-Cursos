$(document).ready(function() {

    //$(".main div").hide(); 

    iniciar();

    //Habilitamos el modo noLogin.
    modoNoLogin();

    //Cargamos variables globales.
    var mi_id = undefined;
    var mi_user = undefined;
    var mi_password = undefined;
    var login = false;
    var id_curso = undefined;
    var vacantes = undefined;
    var dia_select = undefined;


    //Caso en el que se presiona el sliderbar.
    $('.slidebar a').click(function(event) {
        event.preventDefault();
        /*if ($(this).closest("li").attr("id") == "active"){ 
        //si le menu cliquer est déjà ouvert.
        alert("Este panel ya está activo");
        return       
        }else{*/

        //$("#tab1").hide(); 
        //Ocultamos todos los paneles.
        $('div.main').children('div').hide();

        //Coloco el estado del sliderbar en no activo.
        $(".slidebar li").attr("id", "");

        //Coloco el estado del sliderbar (el que pulso) en modo activo.
        $(this).parent().attr("id", "active");

        //Muestro el contenido correspondiente.     
        $('#' + $(this).attr('name')).fadeIn();

        //En el caso de que sea el panel de login ocultamos el panel de registro y mostramos el login
        if ($(this).attr('name') === "tab2") {
            $('#panel_registro').hide();
            mostrarLogin();
        } else if ($(this).attr('name') === "tab3") {
            dia_select = new Date();
            mostrarGestorCursos();
        } else if ($(this).attr('name') === "tab4") {
            iniciar();
            modoNoLogin();
        }

        //Mando el foco al primer input encontrado.
        $('#' + $(this).attr('name') + " input:first").focus();
        //}
    });

    // ========================
    //     TAB 1 - CURSOS 
    // ========================

    $('#tab1').on('click', '#boton_busqueda, .num_pagination, #despues, #antes', function(event) {
        event.preventDefault();

        var contenido_busqueda = $('#contenido_busqueda').val();
        //Comprobamos si ha metido algo en el campo.
        if (contenido_busqueda !== "") {
            var limite = 5;
            var posicion = 1;
            var total = 0;
            var chivato = true;
            var error_paginacion = false;
            var pulsado = $(this).attr('id');

            //Caso en el que no hayamos pulsado el botón de busqueda.
            if (pulsado === "despues" || pulsado === "antes") {
                var elemento = undefined;
                if (pulsado === "despues") {
                    elemento = $('.active').next().children();
                } else if (pulsado === "antes") {
                    elemento = $('.active').prev().children();
                }
                chivato = false;
                if (elemento.attr('data-num') !== undefined) {
                    $('.cuadra_pagina').removeClass('active');
                    elemento.parent().addClass('active');
                    posicion = 1 + ((elemento.attr('data-num') - 1) * 5);
                } else {
                    error_paginacion = true;
                }
            } else if ($(this).attr('id') !== "boton_busqueda") {
                posicion = 1 + (($(this).attr('data-num') - 1) * 5);
                chivato = false;
                //Control de visualización de paginación.
                $('.cuadra_pagina').removeClass('active')
                $(this).parent().addClass('active');
            }
            if (!error_paginacion) {
                $.ajax({
                    type: 'GET',
                    url: '/cursos/getinfobynametotal',
                    data: {
                        nombre: contenido_busqueda
                    },
                    success: function(data, textStatus, jqXHR) {
                        if (data.respuesta === undefined) {
                            alertify.error("No encontrado el contenido en la BBDD");
                            $('.tabla_busquedas').fadeOut();
                        } else {
                            total = Number(data.respuesta);
                            $.ajax({
                                type: 'GET',
                                url: '/cursos/getinfobyname',
                                data: {
                                    nombre: contenido_busqueda,
                                    limite: limite,
                                    posicion: posicion
                                },
                                success: function(data_2, textStatus, jqXHR) {
                                    if (data_2.respuesta === undefined) {
                                        alertify.error("No encontrado el contenido en la BBDD");
                                        $('.tabla_busquedas').fadeOut();
                                    } else {
                                        //Comprobamos si hay que generar la paginación y la tabla al ser busqueda nueva.
                                        if (chivato) {
                                            var modulo = total % 5;
                                            total = total / 5;
                                            if (modulo === 0) {
                                                total = Number(total) - 1.0;
                                            }
                                            total = Math.floor(total);
                                            $('.cuadra_pagina').empty();
                                            $('#antes').after('<li id="primera_paginacion" class="active cuadra_pagina"><a class="num_pagination" href="#" data-num="1">1 <span class="sr-only">(current)</span></a></li>');
                                            for (var i = Number(total); i > 0; i--) {
                                                $('#primera_paginacion').after('<li class="cuadra_pagina"><a class="num_pagination" href="#" data-num="' + Number(i + 1) + '">' + Number(i + 1) + '</a></li>');
                                            }
                                        }
                                        //Rellenamos las filas de la tabla.
                                        $('.lineas_curso').empty();
                                        vacantes = 0;
                                        var id_class = "";
                                        data_2.respuesta.forEach(function(linea) {
                                            $.ajax({
                                                type: 'GET',
                                                url: '/cursos/vacantesCurso',
                                                data: {
                                                    id: linea.id
                                                },
                                                success: function(data_3, textStatus, jqXHR) {
                                                    vacantes = Number(linea.plazas_disp) - Number(data_3.respuesta);
                                                    id_class = "";
                                                    if (vacantes === 1) {
                                                        id_class = "ultima_vacante";
                                                    } else if (vacantes <= 0) {
                                                        id_class = "not_vacante";
                                                    }
                                                    $('.tabla_busquedas table').append('<tr id="' + id_class + '" class="lineas_curso" data-toggle="modal" data-target="#myModal" data-num=' + linea.id + '><td>' + linea.titulo + '</td><td>' + linea.localidad + '</td><td>' + linea.fecha_ini + '</td><td>' + linea.fecha_fin + '</td><td>' + vacantes + '</td></tr>');
                                                },
                                                error: function(jqXHR, statusText, errorThrown) {
                                                    alertify.error("Error al buscar el total por nombre");
                                                }
                                            });
                                        });
                                        $('.tabla_busquedas').fadeIn();
                                    }
                                },
                                error: function(jqXHR, statusText, errorThrown) {
                                    alertify.error("Error al buscar por nombre");
                                }
                            });
                        }
                    },
                    error: function(jqXHR, statusText, errorThrown) {
                        alertify.error("Error al buscar el total por nombre");
                    }
                });
            }
        } else {
            alertify.log("Introduce algo en el campo de busqueda");
            $('.tabla_busquedas').fadeOut();
            $('#contenido_busqueda').focus();
        }
    });

    $("#tab1").on("click", ".lineas_curso", function(event) {
        event.preventDefault();
        //Recojo el id que está almacenado en el atributo data-num.
        id_curso = $(this).attr("data-num");
        vacantes = 0;
        if (id_curso !== undefined) {
            //Buscamos el contenido del curso.
            $.ajax({
                type: 'GET',
                url: '/cursos/getinfobyid',
                data: {
                    id_curso: id_curso
                },
                success: function(data, textStatus, jqXHR) {
                    if (data.respuesta === undefined) {
                        alertify.error("No encontrado el curso en la BBDD");
                        $('.tabla_busquedas').fadeOut();
                    } else {
                        //Buscamos las vacantes disponibles.
                        $.ajax({
                            type: 'GET',
                            url: '/cursos/vacantesCurso',
                            data: {
                                id: id_curso
                            },
                            success: function(data_2, textStatus, jqXHR) {
                                vacantes = Number(data.respuesta.plazas_disp) - Number(data_2.respuesta);
                                $('#myModalLabel').text(data.respuesta.titulo);
                                $('#descripcion_curso').text(data.respuesta.descripcion);
                                $('#imagen_curso').children().remove();
                                $('#imagen_curso').append('<img id="mi_imagen" src="./cursos/cogerImagen/' + id_curso + '">');
                                $('#lugar_imparticion').text(data.respuesta.direccion);
                                $('#ciudad').text(data.respuesta.localidad);
                                $('#duracion').text("Desde el " + data.respuesta.fecha_ini + " hasta el " + data.respuesta.fecha_fin);
                                var horario = data.respuesta.horarios;
                                for (var i = 0; i < horario.length; i++) {
                                    $('#horario').append(horario[i].dia_semana + ": " + horario[i].hora_inicio + " - " + horario[i].hora_fin);
                                    if (i + 1 < horario.length) {
                                        $('#horario').append(", ");
                                    }
                                }
                                $('#num_plazas').text(data.respuesta.plazas_disp + " (" + vacantes + " vacantes)");
                                if (login) {
                                    $('#boton_inscribirse').show();
                                } else {
                                    $('#boton_inscribirse').hide();
                                }
                            },
                            error: function(jqXHR, statusText, errorThrown) {
                                alertify.error("Error al buscar el total por nombre");
                            }
                        });
                    }
                },
                error: function(jqXHR, statusText, errorThrown) {
                    alertify.error("Error al buscar el curso por id");
                }
            });
        }
    });

    // ========================
    //     TAB 2 - USUARIOS 
    // ========================

    $("#tab2").on("click", "#boton_login", function(event) {
        event.preventDefault();

        //Recojo el email y password introducidos y compruebo que están rellenos.

        var user = $('#direccion_login').val();
        var pass = $('#password_login').val();
        var m_mensaje = comprobarLogin();
        if (m_mensaje === "") {
            var cadenaBase64 = btoa(user + ":" + pass);
            $.ajax({
                method: "GET",
                url: "/usuarios/login",
                beforeSend: function(req) {
                    req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
                },
                success: function(data, state, jqXHR) {
                    if (data.datos) {
                        iniciar();
                        modoLogin(user, pass, data.datos.id);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alertify.error("Autorización no concedida");
                }
            });
        } else {
            $('#direccion_login').focus();
            alertify.error(m_mensaje);
        }
    });

    $("#crear_cuenta").on("click", function(event) {
        event.preventDefault();
        mostrarRegis();
    });

    $("#volver_login").on("click", function(event) {
        event.preventDefault();
        mostrarLogin();
    });

    $("#boton_nuevo_usuario").on("click", function(event) {

        event.preventDefault();
        //Recogemos todos los valores y comprobamos que son correctos.
        var email = $('#reg_email').val();
        var password = $('#reg_password').val();
        var sexo = $('#reg_sexo:checked').val();
        var nombre = $('#reg_nombre').val();
        var apellidos = $('#reg_apellidos').val();
        var fecha_nacimiento = $('#reg_fecha_nacimiento').val();
        var mensaje = comprobarRegistro();
        if (mensaje === "") {
            //Realizamos la insercción
            $.ajax({
                type: 'POST',
                url: '/usuarios/insertUser',
                contentType: "application/json",
                // Al ser una petición de tipo GET, vamos a tener URLs
                // de la siguiente forma: /currency?from=USD&to=EUR&quantity=20
                data: JSON.stringify({
                    nombre: nombre,
                    apellidos: apellidos,
                    sexo: sexo,
                    fecha_nacimiento: fecha_nacimiento,
                    email: email,
                    password: password
                }),

                // En caso de éxito, mostramos el resultado.
                success: function(data, textStatus, jqXHR) {
                    if (data.respuesta === undefined) {
                        alertify.error("Usuario no encontrado en la BBDD");
                    } else {
                        //EJemplo buscar CursoByID -> GET -> getinfobyid
                        //
                        alertify.success("Registrado con ID: " + data.id);
                        mostrarLogin();
                        //$("#resultadoFrom").text(data.respuesta + ". ID: "+ data.id);
                    }

                },
                error: function(jqXHR, statusText, errorThrown) {
                    alertify.error("Error al insertar un usuario");
                }
            });
        } else {
            alertify.error(mensaje);
        }

    });

    $("#boton_inscribirse").on('click', function(event) {
        event.preventDefault();
        //Realizamos la insercción del usuario en el curso.
        if (mi_user !== undefined && mi_password !== undefined) {

            //Lo primero que vamos a comprobar es si existen vacantes disponibles.
            if (vacantes !== 0) {
                var cadenaBase64 = btoa(mi_user + ":" + mi_password);

                $.ajax({
                    method: "GET",
                    url: "/usuarios/estaInscrito",
                    contentType: "application/json",
                    data: {
                        id_curso: id_curso,
                        id_usuario: mi_id
                    },
                    beforeSend: function(req) {
                        req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
                    },
                    success: function(data, state, jqXHR) {
                        if (data.respuesta) {
                            alertify.alert("Este usuario ya está inscrito en este curso.");
                        } else {
                            $.ajax({
                                method: "POST",
                                url: "/usuarios/inscribirUsuarioACurso",
                                contentType: "application/json",
                                data: JSON.stringify({
                                    id_curso: id_curso,
                                    email: mi_user,
                                    pass: mi_password
                                }),
                                beforeSend: function(req) {
                                    req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
                                },
                                success: function(data_2, state, jqXHR) {
                                    if (data_2.respuesta) {
                                        $('#myModal').modal('hide');
                                        $("#boton_busqueda").trigger("click");
                                        alertify.success("Inscrito correctamente");
                                    }
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    alertify.error(errorThrown);
                                }
                            });
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alertify.error(errorThrown);
                    }
                });
            } else {
                alertify.alert("No hay vacantes para este curso");
            }
        } else {
            alertify.error("No estás logeado");
        }
    });

    $("#boton_anterior").on('click', function(event) {
        dia_select.setDate(dia_select.getDate() - 7);
        mostrarGestorCursos();
    });

    $("#boton_siguiente").on('click', function(event) {
        dia_select.setDate(dia_select.getDate() + 7);
        mostrarGestorCursos();
    });

    // ===========================
    //       OTRAS FUNCIONES
    // ===========================

    function iniciar() {
        $(".slidebar li:first").attr("id", "active");

        $(".main div:first").fadeIn();

        //Elementos de panel busqueda.
        $('.tabla_busquedas').hide();

        //Elemento de panel login.
        $('#tab2').hide();

        //Elementos de panel unlogin.
        $('#tab3').hide();
        $('#tab4').hide();

        //Configuramos el slidebar a inicio.
        $('.tab3').hide();
        $('.tab4').hide();

        //Ningún curso seleccionado.
        id_curso = undefined;
    }

    /* -_-_-_-_-_-_-_-_-_-_-_ */
    /* MODOS DE VISUALIZACIÓN */
    /* -_-_-_-_-_-_-_-_-_-_-_ */

    //Visualización de errores.
    function comprobarLogin() {

        var m_direccion_login = $('#direccion_login');
        var m_password_login = $('#password_login');

        var mensaje = "";

        //Control del email.
        if (m_direccion_login.val().trim() === "") {
            if (mensaje !== "")
                mensaje += " y "
            else mensaje += "Introduce ";
            mensaje += "email";
            m_direccion_login.addClass("error");
        } else {
            m_direccion_login.removeClass("error");
        }
        //Control de password.
        if (m_password_login.val().trim() === "") {
            if (mensaje !== "")
                mensaje += " y "
            else mensaje += "Introduce ";
            mensaje += "contraseña";
            m_password_login.addClass("error");
        } else {
            m_password_login.removeClass("error");
        }
        //Control de email válido.
        if (mensaje === "") {
            if (!validaCorreo(m_direccion_login.val().trim())) {
                mensaje += "Introduce un email válido";
                m_direccion_login.addClass("error");
            } else {
                m_direccion_login.removeClass("error");
            }
        }
        return mensaje;
    }

    function comprobarRegistro() {

        var m_email = $('#reg_email');
        var m_password = $('#reg_password');
        var m_nombre = $('#reg_nombre');
        var m_apellidos = $('#reg_apellidos');
        var m_fecha_nacimiento = $('#reg_fecha_nacimiento');

        var mensaje = "";
        var llave = false;

        //Control del email.
        if (m_email.val().trim() === "") {
            m_email.addClass("error");
            llave = true;
        } else {
            m_email.removeClass("error");
        }
        //Control de password.
        if (m_password.val().trim() === "") {
            m_password.addClass("error");
            llave = true;
        } else {
            m_password.removeClass("error");
        }
        //Control de nombre.
        if (m_nombre.val().trim() === "") {
            m_nombre.addClass("error");
            llave = true;
        } else {
            m_nombre.removeClass("error");
        }
        //Control de apellidos.
        if (m_apellidos.val().trim() === "") {
            m_apellidos.addClass("error");
            llave = true;
        } else {
            m_apellidos.removeClass("error");
        }
        //Control de fecha de nacimiento.
        if (m_fecha_nacimiento.val().trim() === "") {
            m_fecha_nacimiento.addClass("error");
            llave = true;
        } else {
            m_fecha_nacimiento.removeClass("error");
        }
        if (llave === true) {
            mensaje = "Todos los campos son obligatorios";
        }
        //Control de email válido.
        if (mensaje === "") {
            if (!validaCorreo(m_email.val().trim())) {
                mensaje += "Introduce un email válido";
                m_email.addClass("error");
            } else {
                m_email.removeClass("error");
            }
        }
        return mensaje;
    }



    function validaCorreo(valor) {
        var reg = /(^[a-zA-Z0-9._-]{1,30})@([a-zA-Z0-9.-]{1,30}$)/;
        if (reg.test(valor)) return true;
        else return false;
    }

    function mostrarLogin() {
        //Ocultamos el panel de login
        $('#panel_registro').fadeOut(function() {
            //Mostramos el panel de registro.
            $('#panel_login').fadeIn();
            $('#direccion_login').focus();
            $('#panel_login input').val("");
        });
    }

    function mostrarRegis() {
        //Ocultamos el panel de login
        $('#panel_login').fadeOut(function() {
            //Mostramos el panel de registro.
            $('#panel_registro').fadeIn();
            $('#reg_email').focus();
            $('#panel_registro input[type="text"],[type="password"],[type="date"]').val("");
            $('#panel_registro input[type="radio"]:first').prop("checked", true);
        });
    }

    function modoNoLogin() {
        login = false;
        mi_user = "";
        mi_password = "";
        mi_id = "";
        $('.tab3').hide();
        $('.tab4').hide();
        $('.tab2').fadeIn('slow');
        $('.menu p').fadeOut('slow');
    }

    function modoLogin(user, pass, id) {
        login = true;
        mi_user = user;
        mi_password = pass;
        mi_id = id;
        $('.tab2').hide();
        $('.tab3').fadeIn('slow');
        $('.tab4').fadeIn('slow');
        $('.menu p').text("Hola: " + mi_user);
        $('.menu p').fadeIn('slow');
    }

    function mostrarGestorCursos() {

        var cadenaBase64 = btoa(mi_user + ":" + mi_password);

        $.ajax({
            method: "GET",
            url: "/usuarios/cursosInscrito",
            beforeSend: function(req) {
                req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
            },
            success: function(data, state, jqXHR) {
                if (data.respuesta) {
                    $('.lineas_cursos_prox').empty();
                    var contadorProx = 0;
                    var contadorAnt = 0;
                    data.respuesta.forEach(function(linea) {
                        if (Date.parse(convertirFormatoFecha(linea.fecha_ini)) > Date.now()) {
                            $('.tabla_proximos_cursos table').append('<tr class="lineas_cursos_prox"><td>' + linea.titulo + '</td><td>' + linea.localidad + '</td><td>' + linea.fecha_ini + '</td><td>' + linea.fecha_fin + '</td></tr>');
                            contadorProx += 1;
                        } else {
                            $('.tabla_cursos_realizados table').append('<tr class="lineas_cursos_prox"><td>' + linea.titulo + '</td><td>' + linea.localidad + '</td><td>' + linea.fecha_ini + '</td><td>' + linea.fecha_fin + '</td></tr>');
                            contadorAnt += 1;
                        }
                    });
                    $('.mensaje_gestor').remove();
                    if (contadorProx > 0) {
                        $('.tabla_proximos_cursos table').fadeIn();
                    } else {
                        $('.tabla_proximos_cursos table').hide();
                        $('.tabla_proximos_cursos').append('<p class="mensaje_gestor">No hay cursos próximos disponibles.</p>');
                    }
                    if (contadorAnt > 0) {
                        $('.tabla_cursos_realizados table').fadeIn();
                    } else {
                        $('.tabla_cursos_realizados table').hide();
                        $('.tabla_cursos_realizados').append('<p class="mensaje_gestor">No hay cursos realizados o en curso.</p>');
                    }

                    //Cargamos el calendario siempre y cuando sea posible.
                    if (data.respuesta !== undefined) {
                        //Aquí tengo que cargar el calendario.
                        var horas = [];

                        var dia_semana = [{
                            "dia": "Domingo",
                            "resta": 7,
                        }, {
                            "dia": "Lunes",
                            "resta": 0
                        }, {
                            "dia": "Martes",
                            "resta": 1
                        }, {
                            "dia": "Miércoles",
                            "resta": 2
                        }, {
                            "dia": "Jueves",
                            "resta": 3
                        }, {
                            "dia": "Viernes",
                            "resta": "Sábado"
                        }];

                        //Controladora de fechas.

                        dia_select.setDate(dia_select.getDate() + (7 - dia_select.getDay()));

                        //Calculamos la fecha de inicio y la fecha de fin.
                        var fecha_hasta = dia_select.getDate() + "-" + (Number(dia_select.getMonth()) + 1) + "-" + dia_select.getFullYear();

                        dia_select.setDate(dia_select.getDate() - 6);
                        var fecha_desde = dia_select.getDate() + "-" + (Number(dia_select.getMonth()) + 1) + "-" + dia_select.getFullYear();

                        //Filtramos por fecha ini y fecha fin.
                        var cursos_filtrados = data.respuesta.filter(function(fecha) {
                            return ((Date.parse(convertirFormatoFecha(fecha_hasta)) >= Date.parse(convertirFormatoFecha(fecha.fecha_ini))) && (Date.parse(convertirFormatoFecha(fecha_desde)) <= Date.parse(convertirFormatoFecha(fecha.fecha_ini)))) || ((Date.parse(convertirFormatoFecha(fecha_desde)) <= Date.parse(convertirFormatoFecha(fecha.fecha_fin))) && (Date.parse(convertirFormatoFecha(fecha_hasta)) >= Date.parse(convertirFormatoFecha(fecha.fecha_fin))));
                        });

                        $('#label_periodo').text(fecha_desde + " - " + fecha_hasta);

                        //Guardamos en un vector todas las fechas.
                        var cuentacursos = 0;

                        cursos_filtrados.forEach(function(curso) {
                            curso.horarios.forEach(function(horario) {
                                horas.push(horario.hora_inicio);
                                horas.push(horario.hora_fin);
                            });
                            cuentacursos++;
                        });
                        if (cuentacursos > 0) {
                            horas.push('00:00');
                            horas.push('24:00');
                            $('.calendario table').fadeIn();
                            $('.calendario div').fadeIn();
                        } else {
                            $('.calendario table').fadeOut();
                        }

                        //Quitamos los duplicados y ordenador.

                        horas = _.sortBy(_.unique(horas));

                        //Pintamos las lineas en la tabla.
                        $('.lineas_calendario').empty();
                        for (var i = 0; i < horas.length - 1; i++) {
                            $('.calendario table').append(
                                '<tr class="lineas_calendario">' + '<td>' + horas[i] + ' - <br> ' + horas[i + 1] + '</td>' + '<td id="' + convertirFormatoHora(horas[i]) + '_lunes"></td>' + '<td id="' + convertirFormatoHora(horas[i]) + '_martes"></td>' + '<td id="' + convertirFormatoHora(horas[i]) + '_miercoles"></td>' + '<td id="' + convertirFormatoHora(horas[i]) + '_jueves"></td>' + '<td id="' + convertirFormatoHora(horas[i]) + '_viernes"></td>' + '<td id="' + convertirFormatoHora(horas[i]) + '_sabado"></td>' + '<td id="' + convertirFormatoHora(horas[i]) + '_domingo"></td>' + '</tr>'
                            );
                        }

                        //Ahora, metemos los eventos dentro de la tabla.
                        var celda = undefined;
                        var horario_celda = undefined;
                        var celda_hora_inicio = undefined;
                        var celda_hora_fin = undefined;
                        var curso_hora_inicio = undefined;
                        var curso_hora_fin = undefined;
                        cursos_filtrados.forEach(function(curso) {
                            curso.horarios.forEach(function(horario) {
                                curso_hora_inicio = horario.hora_inicio;
                                curso_hora_fin = horario.hora_fin;
                                celda = $('#' + convertirFormatoHora(curso_hora_inicio) + '_' + horario.dia_semana.toLowerCase());
                                while (celda !== undefined) {
                                    celda.append('<p>*' + curso.titulo + '</p>');
                                    celda.addClass('contiene');

                                    //Comprobamos si no hay que insertar en mas sitios.
                                    horario_celda = celda.parent().children('td').first().text().split('-');
                                    celda_hora_inicio = horario_celda[0].trim();
                                    celda_hora_fin = horario_celda[1].trim();

                                    if (curso_hora_fin !== celda_hora_fin) {
                                        curso_hora_inicio = celda_hora_fin;
                                        celda = $('#' + convertirFormatoHora(curso_hora_inicio) + '_' + horario.dia_semana.toLowerCase());
                                    } else {
                                        celda = undefined;
                                    }
                                }
                            });
                        });
                    }

                } else {
                    $('.mensaje_gestor').remove();
                    $('.tabla_proximos_cursos table').hide();
                    $('.tabla_proximos_cursos').append('<p class="mensaje_gestor">No hay cursos próximos disponibles.</p>');
                    $('.tabla_cursos_realizados table').hide();
                    $('.tabla_cursos_realizados').append('<p class="mensaje_gestor">No hay cursos realizados o en curso.</p>');
                    $('.calendario table').hide();
                    $('.calendario div').hide();
                    $('.calendario').append('<p class="mensaje_gestor">No te has inscrito a ningún curso.</p>');

                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alertify.error(errorThrown);
            }
        });
    }

    /* -_-_-_-_-_-_-_-_ */
    /* CONTROL DE DATOS */
    /* -_-_-_-_-_-_-_-_ */

    function convertirFormatoFecha(fecha) {
        var parts = fecha.split('-');
        return (parts[2] + "/" + parts[1] + "/" + parts[0]);
    }

    function convertirFormatoHora(hora) {
        var parts = hora.split(':');
        return (parts[0] + "_" + parts[1]);
    }

});
