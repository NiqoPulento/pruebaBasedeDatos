require('dotenv').config()
const express = require('express'); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 

const Usuario = require('./models/Usuario');
const Evento = require('./models/Evento');

const app = express();

app.use(cors());
app.use(express.json());

console.log('Conectando a MongoDB...', process.env.URI);
mongoose.connect(process.env.URI, {}) 
    .then(() => console.log('Conexión Exitosa a Atlas!'))
    .catch((err) => console.log('No se ha podido establecer la conexión', err));

app.get('/api/eventos', async (req, res) => {
    try {
        const eventos = await Evento.aggregate([
            {
                $lookup: {
                    from: 'usuarios',        
                    localField: 'usuario',   
                    foreignField: '_id',     
                    as: 'datosUsuario'       
                }
            }
        ]);
        res.status(200).json(eventos);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los eventos', error: err.message });
    }
});

app.post('/api/eventos', async (req, res) => {
    try {
        const nuevoEvento = new Evento(req.body);
        await nuevoEvento.save();
        res.status(201).json({ message: 'Evento creado exitosamente', evento: nuevoEvento });
    } catch (err) {
        res.status(500).json({ message: 'Error al guardar el evento', error: err.message });
    }
});

// NUEVA RUTA: Eliminar evento
app.delete('/api/eventos/:id', async (req, res) => {
    try {
        const idEvento = req.params.id;
        await Evento.findByIdAndDelete(idEvento);
        res.status(200).json({ message: 'Evento eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el evento', error: err.message });
    }
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
    }
});

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

app.get('/listadoPaises', async (req, res) => {
    try {
        const paises = await Pais.find();
        res.status(200).json(paises)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener países', err })
    }
});

app.get('/listadoComunas', async (req, res) => {
    try {
        const comunas = await Comuna.find();
        res.status(200).json(comunas)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener comunas', err })
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT}`));