/**
 * Clase base para sketches de Processing.js
 * Proporciona funcionalidad común para todos los sketches
 */
import { getCanvasSize, getColors } from '../utils/processing-utils.js';

export class BaseSketch {
    constructor(p) {
        this.p = p;
        this.setupBase();
    }

    /**
     * Configuración base común a todos los sketches
     */
    setupBase() {
        const { width, height } = getCanvasSize();
        this.p.size(width, height);
    }

    /**
     * Obtiene los colores actuales del DOM
     * @returns {{bgColor: number[], primaryColor: number[], secondaryColor: number[]}}
     */
    getColors() {
        return getColors();
    }

    /**
     * Obtiene el tamaño del canvas
     * @returns {{width: number, height: number}}
     */
    getCanvasSize() {
        return getCanvasSize();
    }

    /**
     * Aplica el color de fondo
     */
    applyBackground() {
        const { bgColor } = this.getColors();
        this.p.background(bgColor[0], bgColor[1], bgColor[2]);
    }

    /**
     * Aplica el color primario al stroke
     */
    applyPrimaryStroke() {
        const { primaryColor } = this.getColors();
        this.p.stroke(primaryColor[0], primaryColor[1], primaryColor[2]);
    }

    /**
     * Aplica el color primario al fill
     */
    applyPrimaryFill() {
        const { primaryColor } = this.getColors();
        this.p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
    }

    /**
     * Aplica el color secundario al stroke
     */
    applySecondaryStroke() {
        const { secondaryColor } = this.getColors();
        this.p.stroke(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    }

    /**
     * Aplica el color secundario al fill
     */
    applySecondaryFill() {
        const { secondaryColor } = this.getColors();
        this.p.fill(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    }
}

