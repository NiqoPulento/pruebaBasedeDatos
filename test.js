const mongoose = require('mongoose');
const Usuario = require('./backend/models/Usuario');
const Evento = require('./backend/models/Evento');

mongoose.connect('mongodb://localhost:27017/IEI_N3_C3', {})
    .then(async () => {
        console.log('Conectado a MongoDB. Insertando datos de prueba...');
        
        // 1. Creamos un usuario
        const nuevoUsuario = new Usuario({
            nombre: "Juan Pérez",
            rut: "19.123.456-7",
            correo: "juan.perez@correo.cl",
            nacionalidad: "CL",
            genero: "M",
            direccion: { comuna: "Concepción", calle: "Barros Arana", numero: "100" },
            contrasena: "claveSegura123"
        });
        const usuarioGuardado = await nuevoUsuario.save();

        // 2. Creamos un evento asociado a ese usuario
        const nuevoEvento = new Evento({
            usuario: usuarioGuardado._id,
            nombre: "Charla de Desarrollo Backend",
            categoria: "Tecnología",
            lugar: "Sede Principal",
            fecha: new Date("2026-08-15"),
            hora: "15:00",
            costo: 5000,
            organizador: "Juan Pérez"
        });
        await nuevoEvento.save();

        console.log('¡Datos insertados con éxito! Ya puedes cerrar este script (Ctrl + C).');
        process.exit();
    })
    .catch(err => console.log('Error:', err));