// Importación de dependencias para ejecutar nuestra app en backend
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ==========================================
// 1. IMPORTACIONES DE TUS NUEVOS MODELOS
// ==========================================
const Evento = require('./models/Evento');
const Usuario = require('./models/Usuario'); // Este reemplaza al esquema viejo

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// 2. CONEXIÓN A LA BASE DE DATOS
// ==========================================
mongoose.connect('mongodb://localhost:27017/IEI_N3_C3', {}) 
    .then(() => console.log('Conexión Exitosa!'))
    .catch((err) => console.log('No se ha podido establecer la conexión con el servidor ', err));

// ==========================================
// 3. MODELOS ANTIGUOS DE CLASE
// (Se mantienen aquí porque no los hemos modularizado)
// ==========================================
const comuna = new mongoose.Schema({
    codigo_comuna: String,
    nombre_comuna: String,
    codigo_postal: String,
    nombre_region: String
});
const Comuna = mongoose.model('Comuna', comuna, 'comunas');

const pais = new mongoose.Schema({
    nombre: String,
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});
const Pais = mongoose.model('Pais', pais, 'paises');

// ==========================================
// 4. RUTAS DE USUARIOS
// ==========================================
app.post('/guardarUsuario', async (req, res) => {
    try {
        // Ahora usamos directamente req.body para que apliquen las validaciones de tu nuevo Schema
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        
        res.status(200).json({ message: 'Datos de usuario almacenados correctamente.' })
    } catch (err) {
        res.status(500).json({ message: 'No ha sido posible almacenar los datos: ', error: err.message })
    }
});

app.get('/listadoUsuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.aggregate([{
            $lookup: {
                from: 'paises', 
                localField: 'nacionalidad', 
                foreignField: 'iso2', 
                as: 'gentilicio' 
            }
        }, {
            $unwind: {
                path: '$gentilicio',
                preserveNullAndEmptyArrays: true
            }
        }]);
        res.status(200).json(usuarios)
    } catch (err) {
        res.status(500).json({ message: 'No ha sido posible obtener los datos: ', err })
    }
});

// ==========================================
// 5. NUEVAS RUTAS DE EVENTOS (Evaluación 3)
// ==========================================
app.post('/eventos', async (req, res) => {
    try {
        const nuevoEvento = new Evento(req.body);
        const eventoGuardado = await nuevoEvento.save();

        res.status(201).json({
            mensaje: 'Evento registrado con éxito',
            evento: eventoGuardado
        });
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al registrar el evento',
            error: error.message
        });
    }
});

app.get('/eventos', async (req, res) => {
    try {
        const eventos = await Evento.aggregate([
            {
                $lookup: {
                    from: 'usuarios',         
                    localField: 'usuario',    
                    foreignField: '_id',      
                    as: 'datosUsuario'        
                }
            },
            {
                $unwind: '$datosUsuario'
            }
        ]);

        res.status(200).json(eventos);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar los eventos',
            error: error.message
        });
    }
});

// ==========================================
// 6. RUTAS SECUNDARIAS
// ==========================================
app.get('/listadoPaises', async (req, res) => {
    try {
        const paises = await Pais.find();
        res.status(200).json(paises)
    } catch (err) {
        res.status(500).json({ message: 'No ha sido posible obtener los datos: ', err })
    }
});

app.get('/listadoComunas', async (req, res) => {
    try {
        const comunas = await Comuna.find();
        res.status(200).json(comunas)
    } catch (err) {
        res.status(500).json({ message: 'No ha sido posible obtener los datos: ', err })
    }
});

// ==========================================
// 7. INICIALIZACIÓN DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el Puerto: ${PORT}`));