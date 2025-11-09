// Processing.js sketches para diferentes tipos de arte generativo

let currentSketch = null;
let processingInstance = null;

// ========== UTILIDADES COMUNES ==========

/**
 * Convierte un color hexadecimal a array RGB [R, G, B]
 * @param {string} hex - Color en formato hexadecimal (#RRGGBB)
 * @returns {number[]} Array con valores RGB [0-255, 0-255, 0-255]
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [255, 255, 255];
}

/**
 * Obtiene un valor numérico de un elemento del DOM
 * @param {string} elementId - ID del elemento
 * @param {number} defaultValue - Valor por defecto
 * @returns {number}
 */
function getNumericValue(elementId, defaultValue) {
    const element = document.getElementById(elementId);
    if (!element) return defaultValue;
    const value = parseFloat(element.value);
    return isNaN(value) ? defaultValue : value;
}

/**
 * Obtiene un valor booleano de un checkbox del DOM
 * @param {string} elementId - ID del elemento
 * @param {boolean} defaultValue - Valor por defecto
 * @returns {boolean}
 */
function getBooleanValue(elementId, defaultValue) {
    const element = document.getElementById(elementId);
    if (!element) return defaultValue;
    return element.checked;
}

/**
 * Obtiene un valor de texto de un elemento del DOM
 * @param {string} elementId - ID del elemento
 * @param {string} defaultValue - Valor por defecto
 * @returns {string}
 */
function getStringValue(elementId, defaultValue) {
    const element = document.getElementById(elementId);
    if (!element) return defaultValue;
    return element.value || defaultValue;
}

/**
 * Obtiene las dimensiones del canvas desde el DOM
 * @returns {{width: number, height: number}}
 */
function getCanvasSize() {
    return {
        width: getNumericValue('canvasWidth', 800),
        height: getNumericValue('canvasHeight', 600)
    };
}

/**
 * Obtiene los colores del canvas desde el DOM
 * @returns {{bgColor: number[], primaryColor: number[], secondaryColor: number[]}}
 */
function getColors() {
    return {
        bgColor: hexToRgb(getStringValue('bgColor', '#000000')),
        primaryColor: hexToRgb(getStringValue('primaryColor', '#ffffff')),
        secondaryColor: hexToRgb(getStringValue('secondaryColor', '#00ff00'))
    };
}

/**
 * Inicializa una instancia de Processing.js
 * @param {string} canvasId - ID del canvas
 * @param {Function} sketch - Función del sketch
 * @returns {Processing} Instancia de Processing
 */
function initProcessing(canvasId, sketch) {
    const canvas = document.getElementById(canvasId);
    if (processingInstance) {
        processingInstance.exit();
    }
    processingInstance = new Processing(canvas, sketch);
    return processingInstance;
}

// ========== SKETCHES ==========

// Sketch de Fractal
function fractalSketch(p) {
    let iterations = 10;
    let angle = 30;
    let length = 100;
    let bgColor = [0, 0, 0];
    let primaryColor = [255, 255, 255];

    p.setup = function() {
        const size = getCanvasSize();
        p.size(size.width, size.height);
        const colors = getColors();
        p.background(colors.bgColor[0], colors.bgColor[1], colors.bgColor[2]);
    };

    p.draw = function() {
        try {
            iterations = getNumericValue('fractalIterations', 10);
            // Limitar iteraciones para evitar colgar el navegador
            if (iterations > 15) {
                iterations = 15;
                const el = document.getElementById('fractalIterations');
                if (el) el.value = 15;
            }
            angle = getNumericValue('fractalAngle', 90);
            length = getNumericValue('fractalLength', 100);
            const colors = getColors();
            bgColor = colors.bgColor;
            primaryColor = colors.primaryColor;

            p.background(bgColor[0], bgColor[1], bgColor[2]);
            p.stroke(primaryColor[0], primaryColor[1], primaryColor[2]);
            p.strokeWeight(1);
            p.translate(p.width / 2, p.height);
            
            drawBranch(p, length, iterations, angle);
            p.noLoop();
        } catch (error) {
            console.error('Error en fractal:', error);
            p.noLoop();
        }
    };

    function drawBranch(p, len, depth, ang) {
        if (depth <= 0 || len < 1) return;
        
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        
        if (len * 0.67 > 1) {
            p.pushMatrix();
            p.rotate(p.radians(ang));
            drawBranch(p, len * 0.67, depth - 1, ang);
            p.popMatrix();
            
            p.pushMatrix();
            p.rotate(p.radians(-ang));
            drawBranch(p, len * 0.67, depth - 1, ang);
            p.popMatrix();
        }
    }
}

// Sketch de Mandala
function mandalaSketch(p) {
    let segments = 12;
    let radius = 50;
    let layers = 5;
    let bgColor = [0, 0, 0];
    let primaryColor = [255, 255, 255];
    let secondaryColor = [0, 255, 0];

    p.setup = function() {
        const size = getCanvasSize();
        p.size(size.width, size.height);
        const colors = getColors();
        p.background(colors.bgColor[0], colors.bgColor[1], colors.bgColor[2]);
    };

    p.draw = function() {
        segments = getNumericValue('mandalaSegments', 12);
        radius = getNumericValue('mandalaRadius', 50);
        layers = getNumericValue('mandalaLayers', 5);
        const colors = getColors();
        bgColor = colors.bgColor;
        primaryColor = colors.primaryColor;
        secondaryColor = colors.secondaryColor;

        p.background(bgColor[0], bgColor[1], bgColor[2]);
        p.translate(p.width / 2, p.height / 2);
        
        for (let layer = 0; layer < layers; layer++) {
            const layerRadius = radius * (layer + 1) / layers;
            const color = layer % 2 === 0 ? primaryColor : secondaryColor;
            p.stroke(color[0], color[1], color[2]);
            p.noFill();
            
            for (let i = 0; i < segments; i++) {
                const angle1 = (Math.PI * 2 / segments) * i;
                const angle2 = (Math.PI * 2 / segments) * (i + 1);
                const x1 = p.cos(angle1) * layerRadius;
                const y1 = p.sin(angle1) * layerRadius;
                const x2 = p.cos(angle2) * layerRadius;
                const y2 = p.sin(angle2) * layerRadius;
                
                p.line(0, 0, x1, y1);
                p.arc(0, 0, layerRadius * 2, layerRadius * 2, angle1, angle2);
            }
        }
        p.noLoop();
    };
}

// Sketch de Campo Vectorial
function vectorFieldSketch(p) {
    let density = 20;
    let scale = 0.02;
    let force = 5;
    let bgColor = [0, 0, 0];
    let primaryColor = [255, 255, 255];

    p.setup = function() {
        const size = getCanvasSize();
        p.size(size.width, size.height);
        const colors = getColors();
        p.background(colors.bgColor[0], colors.bgColor[1], colors.bgColor[2]);
    };

    p.draw = function() {
        density = getNumericValue('vectorDensity', 20);
        scale = getNumericValue('vectorScale', 0.02);
        force = getNumericValue('vectorForce', 5);
        const colors = getColors();
        bgColor = colors.bgColor;
        primaryColor = colors.primaryColor;

        p.background(bgColor[0], bgColor[1], bgColor[2]);
        p.stroke(primaryColor[0], primaryColor[1], primaryColor[2]);
        
        const spacing = p.width / density;
        
        for (let x = 0; x < p.width; x += spacing) {
            for (let y = 0; y < p.height; y += spacing) {
                const angle = p.noise(x * scale, y * scale) * Math.PI * 2 * force;
                const vx = p.cos(angle) * force;
                const vy = p.sin(angle) * force;
                
                p.pushMatrix();
                p.translate(x, y);
                p.line(0, 0, vx, vy);
                p.popMatrix();
            }
        }
        p.noLoop();
    };
}

// Sketch de Simulación de Partículas
function particleSketch(p) {
    let particles = [];
    let particleCount = 100;
    let speed = 2;
    let gravity = 0.1;
    let bgColor = [0, 0, 0];
    let primaryColor = [255, 255, 255];

    function Particle() {
        this.x = p.random(p.width);
        this.y = p.random(p.height);
        this.vx = p.random(-speed, speed);
        this.vy = p.random(-speed, speed);
        this.size = p.random(2, 5);
    }

    Particle.prototype.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;
        
        if (this.x < 0 || this.x > p.width) this.vx *= -1;
        if (this.y < 0 || this.y > p.height) this.vy *= -1;
        
        this.x = p.constrain(this.x, 0, p.width);
        this.y = p.constrain(this.y, 0, p.height);
    };

    Particle.prototype.display = function() {
        p.ellipse(this.x, this.y, this.size, this.size);
    };

    p.setup = function() {
        const size = getCanvasSize();
        p.size(size.width, size.height);
        const colors = getColors();
        p.background(colors.bgColor[0], colors.bgColor[1], colors.bgColor[2]);
        
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    p.draw = function() {
        particleCount = getNumericValue('particleCount', 100);
        speed = getNumericValue('particleSpeed', 2);
        gravity = getNumericValue('particleGravity', 0.1);
        const colors = getColors();
        bgColor = colors.bgColor;
        primaryColor = colors.primaryColor;

        p.background(bgColor[0], bgColor[1], bgColor[2], 20);
        p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
        
        if (particles.length !== particleCount) {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        particles.forEach(particle => {
            particle.update();
            particle.display();
        });
    };
}

// Sketch de Perlin Noise
function perlinSketch(p) {
    let scale = 0.01;
    let speed = 0.02;
    let detail = 8;
    let time = 0;
    let bgColor = [0, 0, 0];
    let primaryColor = [255, 255, 255];

    p.setup = function() {
        const size = getCanvasSize();
        p.size(size.width, size.height);
        const colors = getColors();
        p.background(colors.bgColor[0], colors.bgColor[1], colors.bgColor[2]);
    };

    p.draw = function() {
        scale = getNumericValue('perlinScale', 0.01);
        speed = getNumericValue('perlinSpeed', 0.02);
        detail = getNumericValue('perlinDetail', 8);
        const colors = getColors();
        bgColor = colors.bgColor;
        primaryColor = colors.primaryColor;

        p.background(bgColor[0], bgColor[1], bgColor[2]);
        
        for (let x = 0; x < p.width; x += detail) {
            for (let y = 0; y < p.height; y += detail) {
                const noiseVal = p.noise(x * scale, y * scale, time);
                const brightness = p.map(noiseVal, 0, 1, 0, 255);
                p.fill(primaryColor[0], primaryColor[1], primaryColor[2], brightness);
                p.noStroke();
                p.rect(x, y, detail, detail);
            }
        }
        
        time += speed;
    };
}

// Sketch de Formas Matemáticas
function mathematicalSketch(p) {
    let mathType = 'spiral';
    let paramA = 5;
    let paramB = 3;
    let bgColor = [0, 0, 0];
    let primaryColor = [255, 255, 255];
    let t = 0;

    p.setup = function() {
        const size = getCanvasSize();
        p.size(size.width, size.height);
        const colors = getColors();
        p.background(colors.bgColor[0], colors.bgColor[1], colors.bgColor[2]);
    };

    p.draw = function() {
        mathType = getStringValue('mathType', 'spiral');
        paramA = getNumericValue('mathParamA', 5);
        paramB = getNumericValue('mathParamB', 3);
        const colors = getColors();
        bgColor = colors.bgColor;
        primaryColor = colors.primaryColor;

        p.background(bgColor[0], bgColor[1], bgColor[2]);
        p.translate(p.width / 2, p.height / 2);
        p.stroke(primaryColor[0], primaryColor[1], primaryColor[2]);
        p.noFill();

        let x, y;
        const scale = 50;
        const maxT = Math.PI * 2 * 10;

        p.beginShape();
        for (let i = 0; i <= maxT; i += 0.1) {
            if (mathType === 'spiral') {
                const r = i * paramA;
                x = p.cos(i) * r;
                y = p.sin(i) * r;
            } else if (mathType === 'lissajous') {
                x = p.cos(paramA * i) * scale;
                y = p.sin(paramB * i) * scale;
            } else if (mathType === 'rose') {
                const r = scale * p.cos(paramA * i);
                x = r * p.cos(i);
                y = r * p.sin(i);
            } else if (mathType === 'lemniscate') {
                const r = scale * p.cos(i);
                x = r * p.cos(i);
                y = r * p.sin(i) * p.cos(i);
            }
            p.vertex(x, y);
        }
        p.endShape();
        p.noLoop();
    };
}

// Sketch de Tensiones Ilustradas
function tensionsSketch(p) {
    let nodes = [];
    let nodeCount = 20;
    let force = 0.5;
    let minDist = 50;
    let maxDist = 200;
    let thickness = 1;
    let animate = true;
    let bgColor = [0, 0, 0];
    let primaryColor = [255, 255, 255];
    let secondaryColor = [0, 255, 0];

    function Node(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = 3;
    }

    Node.prototype.update = function(otherNodes) {
        let fx = 0;
        let fy = 0;
        
        for (let i = 0; i < otherNodes.length; i++) {
            const other = otherNodes[i];
            if (other === this) continue;
            
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 0 && dist < maxDist) {
                // Fuerza de repulsión cercana
                if (dist < minDist) {
                    const repulsion = (minDist - dist) / minDist;
                    fx -= (dx / dist) * repulsion * force * 2;
                    fy -= (dy / dist) * repulsion * force * 2;
                } 
                // Fuerza de atracción a distancia media
                else if (dist > minDist && dist < maxDist) {
                    const attraction = (dist - minDist) / (maxDist - minDist);
                    fx += (dx / dist) * attraction * force * 0.5;
                    fy += (dy / dist) * attraction * force * 0.5;
                }
            }
        }
        
        // Aplicar fuerzas con amortiguación
        this.vx = (this.vx + fx) * 0.85;
        this.vy = (this.vy + fy) * 0.85;
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Mantener dentro del canvas
        if (this.x < 0) { this.x = 0; this.vx *= -0.5; }
        if (this.x > p.width) { this.x = p.width; this.vx *= -0.5; }
        if (this.y < 0) { this.y = 0; this.vy *= -0.5; }
        if (this.y > p.height) { this.y = p.height; this.vy *= -0.5; }
    };

    Node.prototype.display = function() {
        p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
        p.noStroke();
        p.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    };

    p.setup = function() {
        const size = getCanvasSize();
        p.size(size.width, size.height);
        const colors = getColors();
        p.background(colors.bgColor[0], colors.bgColor[1], colors.bgColor[2]);
        
        // Inicializar nodos
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node(
                p.random(p.width),
                p.random(p.height)
            ));
        }
    };

    p.draw = function() {
        nodeCount = getNumericValue('tensionsNodes', 20);
        force = getNumericValue('tensionsForce', 0.5);
        minDist = getNumericValue('tensionsMinDist', 50);
        maxDist = getNumericValue('tensionsMaxDist', 200);
        thickness = getNumericValue('tensionsThickness', 1);
        animate = getBooleanValue('tensionsAnimate', true);
        const colors = getColors();
        bgColor = colors.bgColor;
        primaryColor = colors.primaryColor;
        secondaryColor = colors.secondaryColor;

        // Ajustar número de nodos si cambió
        if (nodes.length !== nodeCount) {
            if (nodes.length < nodeCount) {
                while (nodes.length < nodeCount) {
                    nodes.push(new Node(
                        p.random(p.width),
                        p.random(p.height)
                    ));
                }
            } else {
                nodes = nodes.slice(0, nodeCount);
            }
        }

        if (animate) {
            p.background(bgColor[0], bgColor[1], bgColor[2], 20);
        } else {
            p.background(bgColor[0], bgColor[1], bgColor[2]);
        }

        // Actualizar nodos
        if (animate) {
            nodes.forEach(node => node.update(nodes));
        }

        // Dibujar líneas de tensión
        p.strokeWeight(thickness);
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];
                const dx = node2.x - node1.x;
                const dy = node2.y - node1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < maxDist && dist > minDist * 0.5) {
                    const alpha = p.map(dist, minDist * 0.5, maxDist, 255, 50);
                    const color = dist < minDist ? primaryColor : secondaryColor;
                    p.stroke(color[0], color[1], color[2], alpha);
                    p.line(node1.x, node1.y, node2.x, node2.y);
                }
            }
        }

        // Dibujar nodos
        nodes.forEach(node => node.display());

        if (!animate) {
            p.noLoop();
        }
    };
}

// Sketch de Tensiones Musicales Ilustradas
function musicalTensionsSketch(p) {
    // Mapeo de notas a números de semitonos desde C
    const noteToSemitone = {
        'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
        'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    
    const semitoneToNote = {
        0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F',
        6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B'
    };
    
    // Intervalos de los modos (desde la tónica)
    const modeIntervals = {
        'ionian': [0, 2, 4, 5, 7, 9, 11],
        'dorian': [0, 2, 3, 5, 7, 9, 10],
        'phrygian': [0, 1, 3, 5, 7, 8, 10],
        'lydian': [0, 2, 4, 6, 7, 9, 11],
        'mixolydian': [0, 2, 4, 5, 7, 9, 10],
        'aeolian': [0, 2, 3, 5, 7, 8, 10],
        'locrian': [0, 1, 3, 5, 6, 8, 10]
    };
    
    // Intervalos de acordes
    const chordIntervals = {
        'maj': [0, 4, 7],
        'm': [0, 3, 7],
        '7': [0, 4, 7, 10],
        'maj7': [0, 4, 7, 11],
        'm7': [0, 3, 7, 10],
        'dim': [0, 3, 6],
        'dim7': [0, 3, 6, 9],
        'm7b5': [0, 3, 6, 10],
        'aug': [0, 4, 8]
    };
    
    let notes = [];
    let chordNotes = [];
    let tensionNotes = [];
    let rootNote = 'D';
    let chordQuality = 'm7';
    let mode = 'dorian';
    let tensionsShow = 'all';
    let noteSpacing = 80;
    let circleRadius = 200;
    let lineThickness = 2;
    let showNames = true;
    let animate = false;
    let bgColor = [0, 0, 0];
    let primaryColor = [255, 255, 255];
    let secondaryColor = [0, 255, 0];
    let animationTime = 0;

    // Calcular notas del acorde
    function calculateChordNotes(root, quality) {
        const rootSemitone = noteToSemitone[root];
        const intervals = chordIntervals[quality] || chordIntervals['maj'];
        
        return intervals.map(interval => {
            const semitone = (rootSemitone + interval) % 12;
            return semitoneToNote[semitone];
        });
    }
    
    // Calcular escala modal
    function calculateModeScale(root, modeName) {
        const rootSemitone = noteToSemitone[root];
        const intervals = modeIntervals[modeName] || modeIntervals['ionian'];
        
        return intervals.map(interval => {
            const semitone = (rootSemitone + interval) % 12;
            return semitoneToNote[semitone];
        });
    }
    
    // Calcular tensiones disponibles
    function calculateTensions(chordNotes, modeScale, showOption) {
        const tensions = [];
        const chordSemitones = chordNotes.map(n => noteToSemitone[n]);
        
        // Tensiones: 9, 11, 13 (que son 2, 4, 6 en octava superior)
        const tensionIntervals = {
            '9': 2,   // 9 = 2
            '11': 5,  // 11 = 4
            '13': 9   // 13 = 6
        };
        
        const rootSemitone = noteToSemitone[chordNotes[0]];
        const modeSemitones = modeScale.map(n => noteToSemitone[n]);
        
        let show9 = false, show11 = false, show13 = false;
        
        if (showOption === 'all' || showOption === '9' || showOption === '9_11' || showOption === '9_13') {
            show9 = true;
        }
        if (showOption === 'all' || showOption === '11' || showOption === '9_11' || showOption === '11_13') {
            show11 = true;
        }
        if (showOption === 'all' || showOption === '13' || showOption === '9_13' || showOption === '11_13') {
            show13 = true;
        }
        
        [['9', show9], ['11', show11], ['13', show13]].forEach(([tension, shouldShow]) => {
            if (!shouldShow) return;
            
            const interval = tensionIntervals[tension];
            const tensionSemitone = (rootSemitone + interval) % 12;
            
            // Verificar que la tensión está en la escala modal
            if (modeSemitones.includes(tensionSemitone)) {
                // Verificar que no es parte del acorde
                if (!chordSemitones.includes(tensionSemitone)) {
                    tensions.push({
                        note: semitoneToNote[tensionSemitone],
                        degree: tension,
                        semitone: tensionSemitone
                    });
                }
            }
        });
        
        return tensions;
    }
    
    // Crear estructura de datos para visualización
    function createNoteStructure(chordNotes, tensionNotes) {
        const allNotes = [];
        const rootSemitone = noteToSemitone[chordNotes[0]];
        
        // Mapeo de intervalos comunes a grados
        const intervalToDegree = {
            0: '1', 3: 'b3', 4: '3', 7: '5', 8: '#5', 10: 'b7', 11: '7'
        };
        
        // Agregar notas del acorde
        chordNotes.forEach((note) => {
            const noteSemitone = noteToSemitone[note];
            const interval = (noteSemitone - rootSemitone + 12) % 12;
            const degree = intervalToDegree[interval] || interval.toString();
            
            allNotes.push({
                note: note,
                type: 'chord',
                degree: degree,
                semitone: noteSemitone
            });
        });
        
        // Agregar tensiones
        tensionNotes.forEach(tension => {
            allNotes.push({
                note: tension.note,
                type: 'tension',
                degree: tension.degree,
                semitone: tension.semitone
            });
        });
        
        return allNotes;
    }
    
    // Calcular posición de nota en círculo
    function getNotePosition(noteSemitone, centerX, centerY, radius) {
        // Distribuir notas en círculo según semitonos
        const angle = (noteSemitone / 12) * Math.PI * 2 - Math.PI / 2;
        return {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            angle: angle
        };
    }

    p.setup = function() {
        const size = getCanvasSize();
        p.size(size.width, size.height);
        const colors = getColors();
        p.background(colors.bgColor[0], colors.bgColor[1], colors.bgColor[2]);
        
        updateMusicalData();
    };
    
    function updateMusicalData() {
        rootNote = getStringValue('musicalRoot', 'D');
        chordQuality = getStringValue('musicalChordQuality', 'm7');
        mode = getStringValue('musicalMode', 'dorian');
        tensionsShow = getStringValue('musicalTensionsShow', 'all');
        noteSpacing = getNumericValue('musicalNoteSpacing', 80);
        circleRadius = getNumericValue('musicalCircleRadius', 200);
        lineThickness = getNumericValue('musicalLineThickness', 2);
        showNames = getBooleanValue('musicalShowNames', true);
        animate = getBooleanValue('musicalAnimate', false);
        const colors = getColors();
        bgColor = colors.bgColor;
        primaryColor = colors.primaryColor;
        secondaryColor = colors.secondaryColor;
        
        // Calcular notas
        chordNotes = calculateChordNotes(rootNote, chordQuality);
        const modeScale = calculateModeScale(rootNote, mode);
        tensionNotes = calculateTensions(chordNotes, modeScale, tensionsShow);
        notes = createNoteStructure(chordNotes, tensionNotes);
    }

    p.draw = function() {
        updateMusicalData();
        
        if (animate) {
            animationTime += 0.02;
            p.background(bgColor[0], bgColor[1], bgColor[2], 20);
        } else {
            p.background(bgColor[0], bgColor[1], bgColor[2]);
        }
        
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        
        // Dibujar líneas de conexión
        p.strokeWeight(lineThickness);
        
        // Conectar notas del acorde entre sí
        for (let i = 0; i < chordNotes.length; i++) {
            for (let j = i + 1; j < chordNotes.length; j++) {
                const note1 = chordNotes[i];
                const note2 = chordNotes[j];
                const pos1 = getNotePosition(noteToSemitone[note1], centerX, centerY, circleRadius);
                const pos2 = getNotePosition(noteToSemitone[note2], centerX, centerY, circleRadius);
                
                p.stroke(primaryColor[0], primaryColor[1], primaryColor[2], 150);
                p.line(pos1.x, pos1.y, pos2.x, pos2.y);
            }
        }
        
        // Conectar tensiones con notas del acorde
        tensionNotes.forEach(tension => {
            const tensionPos = getNotePosition(tension.semitone, centerX, centerY, circleRadius);
            
            chordNotes.forEach(chordNote => {
                const chordPos = getNotePosition(noteToSemitone[chordNote], centerX, centerY, circleRadius);
                
                p.stroke(secondaryColor[0], secondaryColor[1], secondaryColor[2], 100);
                p.line(tensionPos.x, tensionPos.y, chordPos.x, chordPos.y);
            });
        });
        
        // Dibujar círculo de referencia (opcional)
        p.noFill();
        p.stroke(primaryColor[0], primaryColor[1], primaryColor[2], 30);
        p.strokeWeight(1);
        p.ellipse(centerX, centerY, circleRadius * 2, circleRadius * 2);
        
        // Dibujar notas
        notes.forEach(noteData => {
            const pos = getNotePosition(noteData.semitone, centerX, centerY, circleRadius);
            
            // Color según tipo
            if (noteData.type === 'chord') {
                p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
            } else {
                p.fill(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            }
            
            p.noStroke();
            const size = noteData.type === 'chord' ? 15 : 12;
            p.ellipse(pos.x, pos.y, size, size);
            
            // Dibujar nombre de nota
            if (showNames) {
                p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(12);
                const label = noteData.note + (noteData.degree ? '(' + noteData.degree + ')' : '');
                p.text(label, pos.x, pos.y - 20);
            }
        });
        
        if (showNames) {
            p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
            p.textAlign(p.CENTER);
            p.textSize(16);
            const chordName = rootNote + chordQuality + ' (' + mode + ')';
            p.text(chordName, centerX, p.height - 30);
        }
        
        if (!animate) {
            p.noLoop();
        }
    };
}

/**
 * Genera arte según el tipo seleccionado
 */
function generateArt() {
    try {
        const artType = document.getElementById('artType').value;
        const canvas = document.getElementById('processingCanvas');
        
        if (!canvas) {
            console.error('Canvas no encontrado');
            return;
        }
        
        // Limpiar canvas anterior
        if (processingInstance) {
            try {
                processingInstance.exit();
            } catch (e) {
                console.log('Error al cerrar instancia anterior:', e);
            }
            processingInstance = null;
        }
        
        // Limpiar el canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        let sketch;
        switch(artType) {
            case 'fractal':
                sketch = fractalSketch;
                break;
            case 'mandala':
                sketch = mandalaSketch;
                break;
            case 'vectorField':
                sketch = vectorFieldSketch;
                break;
            case 'particles':
                sketch = particleSketch;
                break;
            case 'perlin':
                sketch = perlinSketch;
                break;
            case 'mathematical':
                sketch = mathematicalSketch;
                break;
            case 'tensions':
                sketch = tensionsSketch;
                break;
            case 'musicalTensions':
                sketch = musicalTensionsSketch;
                break;
            default:
                sketch = fractalSketch;
        }
        
        currentSketch = sketch;
        
        // Pequeño delay para asegurar que el DOM está listo
        setTimeout(() => {
            try {
                processingInstance = initProcessing('processingCanvas', sketch);
            } catch (error) {
                console.error('Error inicializando Processing:', error);
                alert('Error al generar el arte. Verifica la consola para más detalles.');
            }
        }, 100);
        
    } catch (error) {
        console.error('Error en generateArt:', error);
        alert('Error al generar el arte: ' + error.message);
    }
}

// Exportar funciones
window.generateArt = generateArt;
window.initProcessing = initProcessing;
window.currentSketch = currentSketch;

