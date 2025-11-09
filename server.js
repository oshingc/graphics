// Servidor Express para API de arte generativo
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const { initializeDatabase, closeDatabase } = require('./db/database');

// Importar rutas
const artworksRoutes = require('./routes/artworks.routes');
const chartsRoutes = require('./routes/charts.routes');
const presetsRoutes = require('./routes/presets.routes');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use('/api/art', artworksRoutes);
app.use('/api/charts', chartsRoutes);
app.use('/api/presets', presetsRoutes);

// Ruta principal - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicializar servidor
async function startServer() {
    try {
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
            console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Error inicializando servidor:', error);
        process.exit(1);
    }
}

// Manejar cierre graceful
process.on('SIGINT', async () => {
    console.log('\nCerrando servidor...');
    try {
        await closeDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Error cerrando servidor:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('\nCerrando servidor...');
    try {
        await closeDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Error cerrando servidor:', error);
        process.exit(1);
    }
});

// Iniciar servidor
startServer();
