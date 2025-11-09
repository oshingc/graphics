/**
 * Utilidades comunes para Processing.js
 */

/**
 * Convierte un color hexadecimal a array RGB [R, G, B]
 * @param {string} hex - Color en formato hexadecimal (#RRGGBB)
 * @returns {number[]} Array con valores RGB [0-255, 0-255, 0-255]
 */
export function hexToRgb(hex) {
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
 * @param {number} defaultValue - Valor por defecto si no se encuentra
 * @returns {number}
 */
export function getNumericValue(elementId, defaultValue = 0) {
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
export function getBooleanValue(elementId, defaultValue = false) {
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
export function getStringValue(elementId, defaultValue = '') {
    const element = document.getElementById(elementId);
    if (!element) return defaultValue;
    return element.value || defaultValue;
}

/**
 * Obtiene las dimensiones del canvas desde el DOM
 * @returns {{width: number, height: number}}
 */
export function getCanvasSize() {
    return {
        width: getNumericValue('canvasWidth', 800),
        height: getNumericValue('canvasHeight', 600)
    };
}

/**
 * Obtiene los colores del canvas desde el DOM
 * @returns {{bgColor: number[], primaryColor: number[], secondaryColor: number[]}}
 */
export function getColors() {
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
export function initProcessing(canvasId, sketch) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        throw new Error(`Canvas con ID "${canvasId}" no encontrado`);
    }
    
    return new Processing(canvas, sketch);
}

