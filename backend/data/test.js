const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); 

const Usuario = require('../models/Usuario');
const Evento = require('../models/Evento');

mongoose.connect(process.env.URI, {})
    .then(async () => {
        console.log('Conectado a Atlas para inyectar datos...');
        
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
    .catch((err) => {
        console.log('Error de conexión o inyección: ', err);
        process.exit(1);
    });