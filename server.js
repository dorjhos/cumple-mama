const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Aumentamos el límite de tamaño para permitir la subida de fotos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos (index.html, admin.html, acepto.html, style.css, cancion.mp3, etc.)
app.use(express.static(__dirname));

// Función auxiliar para leer el archivo JSON
function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            const initialData = { slides: [], messages: [] };
            fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
            return initialData;
        }
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (error) {
        console.error("Error al leer data.json:", error);
        return { slides: [], messages: [] };
    }
}

// Función auxiliar para guardar en el archivo JSON
function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error("Error al guardar en data.json:", error);
        return false;
    }
}

// Ruta API para obtener las diapositivas y mensajes actuales
app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// Ruta API para guardar los cambios realizados desde el Panel Admin
app.post('/api/data', (req, res) => {
    const newData = req.body;
    if (!newData || !Array.isArray(newData.slides) || !Array.isArray(newData.messages)) {
        return res.status(400).json({ error: 'Estructura de datos inválida' });
    }

    const success = saveData(newData);
    if (success) {
        res.json({ message: 'Datos guardados correctamente', data: newData });
    } else {
        res.status(500).json({ error: 'Error al escribir los datos en el servidor' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
