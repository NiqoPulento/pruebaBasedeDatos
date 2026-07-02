const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: [true, 'El evento debe estar asociado a un usuario'] 
    },
    nombre: { 
        type: String, 
        required: [true, 'El nombre del evento es obligatorio'] 
    },
    categoria: { 
        type: String, 
        required: true 
    },
    lugar: { 
        type: String, 
        required: true 
    },
    fecha: { 
        type: Date, 
        required: true 
    },
    hora: { 
        type: String, 
        required: true 
    },
    costo: { 
        type: Number, 
        required: true,
        min: [0, 'El costo no puede ser negativo']
    },
    organizador: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String 
    },
    estado: { 
        type: String, 
        enum: ['Programado', 'En curso', 'Finalizado', 'Cancelado'],
        default: 'Programado'
    }
});

module.exports = mongoose.model('Evento', eventoSchema);