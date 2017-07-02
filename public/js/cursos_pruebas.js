$(document).ready(function() {

    // Rellenamos los elementos de los combobox.
    // Para ello tenemos que hacer una llamada al servicio '/currencies'
    /*$.ajax({
        type: 'GET',
        url: '/currencies',
        success: function (data, textStatus, jqXHR) {
            data.forEach(function(elem) {
                             
            });
        }
    });*/
    
    // Manejador del botón para buscar por id
    $("#Buscar").on("click", function() {
        var id = $("#id").val();
        alert(id);
        // El método find() busca un elemento dentro de $("#from")
        // que se ajuste al selector pasado como parámetro. En este caso
        // se buscan, dentro de <select id="from">...</select>, aquellos
        // elementos <option> que estén seleccionados (solo debería haber uno).
        //var monedaFrom = $("#from").find("option:selected").val();
        
        // Utilizamos el servicio '/currency' pasando los tres parámetros
        $.ajax({
            type: 'GET',
            url: '/cursos/getinfobyid',
            
            // Al ser una petición de tipo GET, vamos a tener URLs
            // de la siguiente forma: /currency?from=USD&to=EUR&quantity=20
            data: {
                id_curso: id
            },
            
            // En caso de éxito, mostramos el resultado.
            success: function (data, textStatus, jqXHR) {
                alert("Sucess");
                if (data.respuesta === undefined) {
                    alert("No encontrado en la BBDD");
                } else {
                    //EJemplo buscar CursoByID -> GET -> getinfobyid
                    $("#resultadoFrom").text(data.respuesta.titulo);
                }
                
            },
            error: function(jqXHR, statusText, errorThrown) {
                alert("Error");
            }
        });
    });

    // Manejador del botón para buscar por nombre
    $("#Buscar_2").on("click", function() {
        var nombre = $("#busqueda").val();
        var limite = $("#limite").val();
        var posicion = $("#posicion").val();
        // El método find() busca un elemento dentro de $("#from")
        // que se ajuste al selector pasado como parámetro. En este caso
        // se buscan, dentro de <select id="from">...</select>, aquellos
        // elementos <option> que estén seleccionados (solo debería haber uno).
        //var monedaFrom = $("#from").find("option:selected").val();
        
        // Utilizamos el servicio '/currency' pasando los tres parámetros
        $.ajax({
            type: 'GET',
            url: '/cursos/getinfobyname',
            
            // Al ser una petición de tipo GET, vamos a tener URLs
            // de la siguiente forma: /currency?from=USD&to=EUR&quantity=20
            data: {
                nombre: nombre,
                limite: limite,
                posicion: posicion
            },
            
            // En caso de éxito, mostramos el resultado.
            success: function (data, textStatus, jqXHR) {
                alert("Sucess");
                if (data.respuesta === undefined) {
                    alert("No encontrado en la BBDD");
                } else {
                    //EJemplo buscar CursoByID -> GET -> getinfobyid
                    $("#resultadoFrom").text(data.respuesta[0].titulo);
                }
                
            },
            error: function(jqXHR, statusText, errorThrown) {
                alert("Error al buscar por nombre");
            }
        });
    });

    // Manejador del botón para insertar un nuevo curso.
    $("#insertar").on("click", function() {
        var titulo = $("#titulo").val();
        var descripcion = $("#descripcion").val();
        var localidad = $("#localidad").val();
        var direccion = $("#direccion").val();
        var plazas_disp = $("#plazas_disp").val();
        var fecha_inicio = $("#fecha_ini").val();
        var fecha_fin = $("#fecha_fin").val();
        // El método find() busca un elemento dentro de $("#from")
        // que se ajuste al selector pasado como parámetro. En este caso
        // se buscan, dentro de <select id="from">...</select>, aquellos
        // elementos <option> que estén seleccionados (solo debería haber uno).
        //var monedaFrom = $("#from").find("option:selected").val();
        
        // Utilizamos el servicio '/currency' pasando los tres parámetros
        $.ajax({
            type: 'POST',
            url: '/cursos/insertarCurso',
            contentType: "application/json",
            // Al ser una petición de tipo GET, vamos a tener URLs
            // de la siguiente forma: /currency?from=USD&to=EUR&quantity=20
            data: 
                JSON.stringify({
                    titulo: titulo,
                    descripcion: descripcion,
                    localidad: localidad,
                    direccion: direccion,
                    plazas_disp: plazas_disp,
                    fecha_ini: fecha_inicio,
                    fecha_fin: fecha_fin
                })
            ,
            
            // En caso de éxito, mostramos el resultado.
            success: function (data, textStatus, jqXHR) {
                alert("Sucess");
                if (data.respuesta === undefined) {
                    alert("No encontrado en la BBDD");
                } else {
                    //EJemplo buscar CursoByID -> GET -> getinfobyid
                    $("#resultadoFrom").text(data.respuesta + ". ID:"+ data.id);
                }
                
            },
            error: function(jqXHR, statusText, errorThrown) {
                alert("Error al insertar un curso");
            }
        });
    });

    // Manejador del botón para modificar un nuevo curso.
    $("#modificar").on("click", function() {
        var id = $("#id_modi").val();
        var titulo = $("#titulo").val();
        var descripcion = $("#descripcion").val();
        var localidad = $("#localidad").val();
        var direccion = $("#direccion").val();
        var plazas_disp = $("#plazas_disp").val();
        var fecha_inicio = $("#fecha_ini").val();
        var fecha_fin = $("#fecha_fin").val();
        // El método find() busca un elemento dentro de $("#from")
        // que se ajuste al selector pasado como parámetro. En este caso
        // se buscan, dentro de <select id="from">...</select>, aquellos
        // elementos <option> que estén seleccionados (solo debería haber uno).
        //var monedaFrom = $("#from").find("option:selected").val();
        
        // Utilizamos el servicio '/currency' pasando los tres parámetros
        $.ajax({
            type: 'PUT',
            url: '/cursos/modificarCurso/'+id,
            contentType: "application/json",
            // Al ser una petición de tipo GET, vamos a tener URLs
            // de la siguiente forma: /currency?from=USD&to=EUR&quantity=20
            data: 
                JSON.stringify({
                    titulo: titulo,
                    descripcion: descripcion,
                    localidad: localidad,
                    direccion: direccion,
                    plazas_disp: plazas_disp,
                    fecha_ini: fecha_inicio,
                    fecha_fin: fecha_fin
                })
            ,
            
            // En caso de éxito, mostramos el resultado.
            success: function (data, textStatus, jqXHR) {
                alert("Sucess");
                if (data.respuesta === undefined) {
                    alert("No encontrado en la BBDD");
                } else {
                    //EJemplo buscar CursoByID -> GET -> getinfobyid
                    $("#resultadoFrom").text(data.respuesta);
                }
                
            },
            error: function(jqXHR, statusText, errorThrown) {
                alert("Error al modificar un curso");
            }
        });
    });

    $("#eliminar").on("click", function() {
        var id = $("#id_eliminar").val();

        // El método find() busca un elemento dentro de $("#from")
        // que se ajuste al selector pasado como parámetro. En este caso
        // se buscan, dentro de <select id="from">...</select>, aquellos
        // elementos <option> que estén seleccionados (solo debería haber uno).
        //var monedaFrom = $("#from").find("option:selected").val();
        
        // Utilizamos el servicio '/currency' pasando los tres parámetros
        $.ajax({
            type: 'DELETE',
            url: '/cursos/eliminarCurso/'+id,
            //contentType: "application/json",
            // Al ser una petición de tipo GET, vamos a tener URLs
            // de la siguiente forma: /currency?from=USD&to=EUR&quantity=20
            /*data: 
                JSON.stringify({
                    
                })
            ,*/
            
            // En caso de éxito, mostramos el resultado.
            success: function (data, textStatus, jqXHR) {
                alert("Sucess");
                if (data.respuesta === undefined) {
                    alert("No encontrado en la BBDD");
                } else {
                    //EJemplo buscar CursoByID -> GET -> getinfobyid
                    $("#resultadoFrom").text(data.respuesta);
                }
                
            },
            error: function(jqXHR, statusText, errorThrown) {
                alert("Error al modificar un curso");
            }
        });
    });
});
















