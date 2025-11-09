/**
 * Manager para gestionar sketches de Processing.js
 */
import { createFractalSketch } from './fractal-sketch.js';
import { createMandalaSketch } from './mandala-sketch.js';
import { createVectorFieldSketch } from './vector-field-sketch.js';
import { createParticleSketch } from './particle-sketch.js';
import { createPerlinSketch } from './perlin-sketch.js';
import { createMathematicalSketch } from './mathematical-sketch.js';
import { createTensionsSketch } from './tensions-sketch.js';
import { createMusicalTensionsSketch } from './musical-tensions-sketch.js';
import { initProcessing } from '../utils/processing-utils.js';

const SKETCH_FACTORIES = {
    fractal: createFractalSketch,
    mandala: createMandalaSketch,
    vectorField: createVectorFieldSketch,
    particles: createParticleSketch,
    perlin: createPerlinSketch,
    mathematical: createMathematicalSketch,
    tensions: createTensionsSketch,
    musicalTensions: createMusicalTensionsSketch
};

export class SketchManager {
    constructor() {
        this.currentInstance = null;
        this.currentSketch = null;
    }

    /**
     * Genera arte según el tipo seleccionado
     * @param {string} artType - Tipo de arte a generar
     * @param {string} canvasId - ID del canvas
     */
    generateArt(artType, canvasId = 'processingCanvas') {
        try {
            const canvas = document.getElementById(canvasId);
            if (!canvas) {
                throw new Error(`Canvas con ID "${canvasId}" no encontrado`);
            }

            // Limpiar instancia anterior
            this.cleanup();

            // Limpiar el canvas
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            // Obtener factory del sketch
            const sketchFactory = SKETCH_FACTORIES[artType];
            if (!sketchFactory) {
                throw new Error(`Tipo de arte "${artType}" no soportado`);
            }

            this.currentSketch = sketchFactory;

            // Pequeño delay para asegurar que el DOM está listo
            setTimeout(() => {
                try {
                    this.currentInstance = initProcessing(canvasId, sketchFactory);
                } catch (error) {
                    console.error('Error inicializando Processing:', error);
                    throw error;
                }
            }, 100);

        } catch (error) {
            console.error('Error en generateArt:', error);
            throw error;
        }
    }

    /**
     * Limpia la instancia actual de Processing
     */
    cleanup() {
        if (this.currentInstance) {
            try {
                this.currentInstance.exit();
            } catch (e) {
                console.log('Error al cerrar instancia anterior:', e);
            }
            this.currentInstance = null;
        }
        this.currentSketch = null;
    }

    /**
     * Obtiene la instancia actual de Processing
     * @returns {Processing|null}
     */
    getCurrentInstance() {
        return this.currentInstance;
    }

    /**
     * Obtiene el sketch actual
     * @returns {Function|null}
     */
    getCurrentSketch() {
        return this.currentSketch;
    }
}

// Exportar instancia singleton
export const sketchManager = new SketchManager();

