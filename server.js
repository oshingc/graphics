// Servidor Express para API de arte generativo
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3003;
const DB_PATH = path.join(__dirname, 'artworks.db');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

// Inicializar base de datos
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error abriendo base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        initializeDatabase();
    }
});

// Inicializar tablas
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS artworks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            parameters TEXT NOT NULL,
            image_data TEXT,
            canvas_size TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creando tabla:', err.message);
        } else {
            console.log('Tabla artworks inicializada.');
        }
    });
}

// Ruta principal - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET /api/art - Obtener todos los artefactos
app.get('/api/art', (req, res) => {
    const query = 'SELECT * FROM artworks ORDER BY timestamp DESC';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error consultando base de datos:', err.message);
            res.status(500).json({ error: 'Error al obtener artefactos' });
        } else {
            const artworks = rows.map(row => ({
                id: row.id,
                type: row.type,
                parameters: JSON.parse(row.parameters),
                imageData: row.image_data,
                canvasSize: JSON.parse(row.canvas_size || '{}'),
                timestamp: row.timestamp
            }));
            res.json(artworks);
        }
    });
});

// GET /api/art/:id - Obtener artefacto específico
app.get('/api/art/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM artworks WHERE id = ?';
    
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Error consultando base de datos:', err.message);
            res.status(500).json({ error: 'Error al obtener artefacto' });
        } else if (!row) {
            res.status(404).json({ error: 'Artefacto no encontrado' });
        } else {
            res.json({
                id: row.id,
                type: row.type,
                parameters: JSON.parse(row.parameters),
                imageData: row.image_data,
                canvasSize: JSON.parse(row.canvas_size || '{}'),
                timestamp: row.timestamp
            });
        }
    });
});

// POST /api/art - Guardar nuevo artefacto
app.post('/api/art', (req, res) => {
    const { type, parameters, imageData, canvasSize } = req.body;
    
    if (!type || !parameters) {
        return res.status(400).json({ error: 'Tipo y parámetros son requeridos' });
    }
    
    const query = `
        INSERT INTO artworks (type, parameters, image_data, canvas_size)
        VALUES (?, ?, ?, ?)
    `;
    
    db.run(query, [
        type,
        JSON.stringify(parameters),
        imageData || null,
        JSON.stringify(canvasSize || {})
    ], function(err) {
        if (err) {
            console.error('Error insertando en base de datos:', err.message);
            res.status(500).json({ error: 'Error al guardar artefacto' });
        } else {
            res.json({ 
                id: this.lastID,
                message: 'Artefacto guardado exitosamente'
            });
        }
    });
});

// DELETE /api/art/:id - Eliminar artefacto
app.delete('/api/art/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM artworks WHERE id = ?';
    
    db.run(query, [id], function(err) {
        if (err) {
            console.error('Error eliminando de base de datos:', err.message);
            res.status(500).json({ error: 'Error al eliminar artefacto' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Artefacto no encontrado' });
        } else {
            res.json({ message: 'Artefacto eliminado exitosamente' });
        }
    });
});

// POST /api/art/:id/manim - Generar renderizado con Manim
app.post('/api/art/:id/manim', async (req, res) => {
    const id = req.params.id;
    
    // Obtener artefacto
    const query = 'SELECT * FROM artworks WHERE id = ?';
    
    db.get(query, [id], async (err, row) => {
        if (err) {
            console.error('Error consultando base de datos:', err.message);
            return res.status(500).json({ error: 'Error al obtener artefacto' });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Artefacto no encontrado' });
        }
        
        try {
            const parameters = JSON.parse(row.parameters);
            const result = await generateManimAnimation(parameters);
            res.json({ 
                message: 'Animación Manim generada',
                outputPath: result
            });
        } catch (error) {
            console.error('Error generando Manim:', error);
            res.status(500).json({ error: 'Error al generar animación Manim' });
        }
    });
});

// Función para generar animación con Manim
async function generateManimAnimation(parameters) {
    const { spawn } = require('child_process');
    const fs = require('fs');
    const path = require('path');
    
    // Crear script Python temporal
    const scriptPath = path.join(__dirname, 'temp_manim_script.py');
    const outputDir = path.join(__dirname, 'manim_output');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    // Generar código Python para Manim basado en parámetros
    const pythonCode = generateManimCode(parameters);
    fs.writeFileSync(scriptPath, pythonCode);
    
    return new Promise((resolve, reject) => {
        const python = spawn('python3', [scriptPath, '-pql', '-o', 'animation']);
        
        let output = '';
        let error = '';
        
        python.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        python.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        python.on('close', (code) => {
            if (code === 0) {
                resolve(path.join(outputDir, 'animation.mp4'));
            } else {
                reject(new Error(`Manim falló: ${error}`));
            }
        });
    });
}

// Generar código Python para Manim
function generateManimCode(parameters) {
    const artType = parameters.artType;
    let code = `
from manim import *

class GenerativeArt(Scene):
    def construct(self):
`;
    
    switch(artType) {
        case 'fractal':
            code += generateFractalManim(parameters.fractal);
            break;
        case 'mandala':
            code += generateMandalaManim(parameters.mandala);
            break;
        case 'mathematical':
            code += generateMathematicalManim(parameters.mathematical);
            break;
        default:
            code += '        self.add(Text("Arte generativo"))\n';
    }
    
    return code;
}

function generateFractalManim(params) {
    return `
        def draw_branch(start, length, angle, depth):
            if depth <= 0:
                return
            end = start + length * np.array([np.cos(angle), np.sin(angle), 0])
            line = Line(start, end, color=WHITE)
            self.add(line)
            draw_branch(end, length * 0.67, angle + ${params.angle || 45} * DEGREES, depth - 1)
            draw_branch(end, length * 0.67, angle - ${params.angle || 45} * DEGREES, depth - 1)
        
        draw_branch(ORIGIN, ${params.length || 2}, PI/2, ${params.iterations || 5})
`;
}

function generateMandalaManim(params) {
    return `
        segments = ${params.segments || 12}
        layers = ${params.layers || 5}
        radius = ${params.radius || 1}
        
        for layer in range(layers):
            layer_radius = radius * (layer + 1) / layers
            for i in range(segments):
                angle = 2 * PI * i / segments
                start = layer_radius * np.array([np.cos(angle), np.sin(angle), 0])
                end = layer_radius * np.array([np.cos(angle + 2*PI/segments), np.sin(angle + 2*PI/segments), 0])
                line = Line(ORIGIN, start, color=WHITE)
                arc = Arc(radius=layer_radius, start_angle=angle, angle=2*PI/segments, color=WHITE)
                self.add(line, arc)
`;
}

function generateMathematicalManim(params) {
    const type = params.type || 'spiral';
    if (type === 'spiral') {
        return `
        def spiral(t):
            r = t * ${params.paramA || 0.1}
            return r * np.array([np.cos(t), np.sin(t), 0])
        
        curve = ParametricFunction(spiral, t_range=[0, 10*PI], color=WHITE)
        self.add(curve)
`;
    }
    return '        self.add(Text("Forma matemática"))\n';
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Base de datos: ${DB_PATH}`);
});

// Cerrar base de datos al terminar
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error cerrando base de datos:', err.message);
        } else {
            console.log('Base de datos cerrada.');
        }
        process.exit(0);
    });
});

