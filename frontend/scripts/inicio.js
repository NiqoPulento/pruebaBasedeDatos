window.onload = function(){
    obtenerUsuarios();
}

async function obtenerUsuarios(){
    try {
        const respuesta = await fetch("http://localhost:3000/listadoUsuarios");
        const datos = await respuesta.json();

        new DataTable('#tablaUsuarios',{
            data:datos,
            columns:[
                {data:'nombre'},
                {data:'email'},
                {data:'fechaNacimiento'},
                {data:'gentilicio.nacionalidad'},
                {data:'tecnologias'},
                {data:'genero'}
            ]
        });

        if (!respuesta.ok) {
            throw new Error(respuesta.status);
        }
    } catch (error) {
        console.log('Ha ocurrido el siguiente error: ', error)
    }
};