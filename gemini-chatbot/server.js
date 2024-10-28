// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors'); // Importa el paquete CORS
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Soporte para JSON en el body

// Inicializa la API de Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Usa la variable de entorno para la clave de API
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Endpoint para procesar el mensaje
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const result = await model.generateContent(message); // Utiliza el mensaje del usuario como prompt
        const reply = result.response.text(); // Extrae el texto de la respuesta

        res.json({ reply }); // Envía la respuesta de vuelta al cliente
    } catch (error) {
        console.error("Error en la API de Google Generative AI:", error);
        res.status(500).json({ error: "Hubo un problema al procesar tu solicitud" });
    }
});

app.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
