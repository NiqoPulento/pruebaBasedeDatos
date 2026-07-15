const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre completo es obligatorio'] 
    },
    rut: { 
        type: String, 
        required: [true, 'El RUT es obligatorio'] 
    },
    correo: { 
        type: String, 
        required: [true, 'El correo electrónico es obligatorio'] 
    },
    telefono: { 
        type: String 
    },
    fechaNacimiento: { 
        type: Date,
        validate: {
            validator: function(value) {
                return value < new Date();
            },
            message: 'La fecha de nacimiento debe ser anterior a la fecha actual.'
        }
    },
    nacionalidad: { 
        type: String, 
        required: [true, 'La nacionalidad es obligatoria'],
        uppercase: true,
        minlength: 2,
        maxlength: 2
    },
    genero: { 
        type: String, 
        enum: {
            values: ['M', 'F', 'O'],
            message: '{VALUE} no es un género válido'
        }
    },
    direccion: {
        type: {
            comuna: { type: String, required: true },
            calle: { type: String, required: true },
            numero: { type: String, required: true },
            departamento: { type: String } 
        },
        required: [true, 'La dirección es obligatoria']
    },
    contrasena: { 
        type: String, 
        required: [true, 'La contraseña es obligatoria'] 
    },
    fechaRegistro: { 
        type: Date, 
        default: Date.now 
    },
    activo: { 
        type: Boolean, 
        default: true 
    }
});

usuarioSchema.pre('save', async function(next) {
    const usuario = this;

    if (!usuario.isModified('contrasena')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);