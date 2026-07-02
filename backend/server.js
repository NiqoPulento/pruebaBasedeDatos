// Importación de dependencias para ejecutar nuestra app en backend
const express = require('express'); // Librería que permitye crear servidores JS
const cors = require('cors'); // Permite la ejecución de scripts desde fuera del servidor
const mongoose = require('mongoose'); // ORM (Object Relational Mapping) automatiza y oculta la creación de scripts de DB

// Iniciamos la aplicación Express
const app = express();
const puerto = 3000;

// Instanciamos las dependencias en nuestra aplicación
app.use(cors());
app.use(express.json());

// Conexión a DB
mongoose.connect('mongodb://localhost:27017/IEI_N3_C3', {}) // Url servidor local + nombre DB
    .then(() => console.log('Conexión Exitosa!'))
    .catch((err) => console.log('No se ha podido establecer la conexión con el servidor ', err));

// Test para ver que la app esté corriendo en el puerto indicado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Puerto: ${PORT}`))

const comuna = new mongoose.Schema({
    codigo_comuna: String,
    nombre_comuna: String,
    codigo_postal: String,
    nombre_region: String
});
const Comuna = mongoose.model('Comuna', comuna, 'comunas');

const direccion = new mongoose.Schema({
    comuna: String,
    calle: String,
    numero: String,
    departamento: String
});

const usuario = new mongoose.Schema({
    nombre: String,
    email: String,
    fechaNacimiento: String,
    nacionalidad: String,
    contrasena: String,
    tecnologias: [String],
    genero: String,
    direccion: [direccion]
});
const Usuario = mongoose.model('Usuario', usuario, 'usuarios');

const pais = new mongoose.Schema(
    {
        nombre: String,
        iso2: String,
        iso3: String,
        codigoPais: String,
        nacionalidad: String
    }
);
const Pais = mongoose.model('Pais', pais, 'paises');

app.post('/guardarUsuario', async (req, res) => {
    try {
        const { nombre, email, fechaNacimiento, nacionalidad, contrasena, tecnologias, genero } = req.body;
        const nuevoUsuario = new Usuario({ nombre, email, fechaNacimiento, nacionalidad, contrasena, tecnologias, genero });

        await nuevoUsuario.save();
        res.status(200).json({ message: 'Datos almacenados correctamente.' })
    } catch (err) {
        res.status(500).send(err.message);
        res.status(500).json({ message: 'No ha sido posible almacenar los datos: ', err })
    }
});

app.get('/listadoPaises', async (req, res) => {
    try {
        const paises = await Pais.find();
        res.status(200).json(paises)
    } catch (err) {
        res.status(500).send(err.message);
        res.status(500).json({ message: 'No ha sido posible obtener los datos: ', err })
    }
});

app.get('/listadoComunas', async (req, res) => {
    try {
        const comunas = await Comuna.find();
        res.status(200).json(comunas)
    } catch (err) {
        res.status(500).send(err.message);
        res.status(500).json({ message: 'No ha sido posible obtener los datos: ', err })
    }
});

app.get('/listadoUsuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.aggregate([{
            $lookup: {
                from: 'paises', // Colección que contiene la información referenciada
                localField: 'nacionalidad', // Campo que contiene la info referenciada
                foreignField: 'iso2', // Campo de la colección referenciada que queremos mostrar
                as: 'gentilicio' // Nombrar el dato (alias)
            }
        }, {
            $unwind: {
                path: '$gentilicio',
                preserveNullAndEmptyArrays: true
            }
        }]);
        res.status(200).json(usuarios)
    } catch (err) {
        res.status(500).send(err.message);
        res.status(500).json({ message: 'No ha sido posible obtener los datos: ', err })
    }
});