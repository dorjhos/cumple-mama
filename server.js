const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json({ limit: '15mb' }));
app.use(express.static(__dirname));

const defaultData = {
    slides: [
        { title: "¡Feliz Cumpleaños Mamá! 🎉", description: "Hoy celebramos tu vida y todo el amor que nos has dado. ¡Te queremos con todo nuestro corazón!" },
        { title: "Gracias por tanto amor 🌸", description: "Gracias por ser nuestra guía, por tus consejos y por estar siempre presente. ¡Que disfrutes muchísimo tu día!" }
    ],
    messages: [
        "Mamá, aunque la distancia nos separe hoy, mi corazón está contigo celebrando tu día.",
        "Disfruta muchísimo tu cumpleaños. Gracias por ser la mejor madre."
    ]
};

// Obtener datos del servidor
app.get('/api/data', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    }
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
});

// Guardar datos en el servidor (desde el admin de cualquier dispositivo)
app.post('/api/data', (req, res) => {
    const { slides, messages } = req.body;
    const newData = {
        slides: slides || defaultData.slides,
        messages: messages || defaultData.messages
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
    res.json({ success: true, message: 'Actualizado en el servidor correctamente' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
