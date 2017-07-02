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
    var mi_user = undefined;
    var mi_password = undefined;
    
    // Manejador del botón para insertar un nuevo curso.
    $("#insertarUser").on("click", function() {
        var nombre = $("#nombre").val();
        var apellidos = $("#apellidos").val();
        var sexo = $("#sexo").val();
        var fecha_nacimiento = $("#fecha_nacimiento").val();
        var email = $("#email").val();
        var password = $("#password").val();


        // El método find() busca un elemento dentro de $("#from")
        // que se ajuste al selector pasado como parámetro. En este caso
        // se buscan, dentro de <select id="from">...</select>, aquellos
        // elementos <option> que estén seleccionados (solo debería haber uno).
        //var monedaFrom = $("#from").find("option:selected").val();
        
        // Utilizamos el servicio '/currency' pasando los tres parámetros
        $.ajax({
            type: 'POST',
            url: '/usuarios/insertUser',
            contentType: "application/json",
            // Al ser una petición de tipo GET, vamos a tener URLs
            // de la siguiente forma: /currency?from=USD&to=EUR&quantity=20
            data: 
                JSON.stringify({
                    nombre: nombre,
                    apellidos: apellidos,
                    sexo: sexo,
                    fecha_nacimiento: fecha_nacimiento,
                    email: email,
                    password: password
                })
            ,
            
            // En caso de éxito, mostramos el resultado.
            success: function (data, textStatus, jqXHR) {
                alert("Sucess");
                if (data.respuesta === undefined) {
                    alert("Usuario no encontrado en la BBDD");
                } else {
                    //EJemplo buscar CursoByID -> GET -> getinfobyid
                    $("#resultadoFrom").text(data.respuesta + ". ID: "+ data.id);
                }
                
            },
            error: function(jqXHR, statusText, errorThrown) {
                alert("Error al insertar un usuario");
            }
        });
    });

    $("#login").on("click", function() {

        var user = $("#user").val();
        var pass = $("#pass").val();
        
        var cadenaBase64 = btoa(user + ":" + pass);
        
        $.ajax({
           method: "GET",
           url: "/usuarios/login",
           beforeSend: function(req) {
               req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
           },
           success: function(data, state, jqXHR) {
               if (data.datos) {
                    $("#resultadoFrom").text("Hola " + data.datos.email);
                    //Guardamos las credenciales.
                    mi_user = user;
                    mi_password = pass;
               } 
           },
           error: function (jqXHR, textStatus, errorThrown) {
               console.log(errorThrown);
           }
        });
    });

    $("#insertUserToCurso").on("click", function() {
        var user = mi_user;
        var pass = mi_password;
        var id = $("#id_curso_inscripcion").val();

        if (user !== undefined && pass !== undefined) {
          var cadenaBase64 = btoa(user + ":" + pass);
        
          $.ajax({
             method: "POST",
             url: "/usuarios/inscribirUsuarioACurso",
             contentType: "application/json",
             data: 
              JSON.stringify({
                      id_curso: id,
                      email: user,
                      pass: pass
                  })
             ,
             beforeSend: function(req) {
                 req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
             },
             success: function(data, state, jqXHR) {
                 if (data.respuesta) {
                      $("#resultadoFrom_2").text(data.respuesta);
                 } 
             },
             error: function (jqXHR, textStatus, errorThrown) {
                 console.log(errorThrown);
             }
          });
        } else {
          alert("No estás logeado");
        }
    });

    $("#cursosInscrito").on("click", function() {
        var user = $("#user").val();
        var pass = $("#pass").val();
        
        var cadenaBase64 = btoa(user + ":" + pass);
        
        $.ajax({
           method: "GET",
           url: "/usuarios/cursosInscrito",
           beforeSend: function(req) {
               req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
           },
           success: function(data, state, jqXHR) {
               if (data.respuesta) {
                    data.respuesta.forEach(function(e){
                        $("#resultadoFrom_3").append("<li>"+e.localidad+"</li>");
                    });
               } 
           },
           error: function (jqXHR, textStatus, errorThrown) {
               console.log(errorThrown);
           }
        });
    });
});
















