/**
 * Configuración de entorno
 * Detecta automáticamente si está en desarrollo o producción
 */

// Detectar el entorno
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1' &&
                     !window.location.hostname.includes('localhost');

// Detectar si está en GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io') ||
                      window.location.hostname.includes('github.com');

// Obtener el path base (necesario para GitHub Pages)
function getBasePath() {
    if (isGitHubPages) {
        // GitHub Pages usa el formato: username.github.io/repo-name
        const pathParts = window.location.pathname.split('/').filter(p => p);
        if (pathParts.length > 0 && pathParts[0] !== 'graphics') {
            // Si el repo no se llama 'graphics', usar el nombre del repo
            return '/' + pathParts[0] + '/';
        }
        return '/graphics/';
    }
    return '/';
}

// Configuración de la API
const API_CONFIG = {
    // URL base de la API
    baseURL: isProduction 
        ? (isGitHubPages 
            ? 'https://your-api-server.com/api' // Cambiar por tu servidor de API en producción
            : window.location.origin + '/api')
        : 'http://localhost:3003/api',
    
    // Timeout para requests
    timeout: 30000,
    
    // Headers por defecto
    headers: {
        'Content-Type': 'application/json'
    }
};

// Configuración de la aplicación
const APP_CONFIG = {
    // Entorno
    environment: isProduction ? 'production' : 'development',
    isProduction: isProduction,
    isGitHubPages: isGitHubPages,
    
    // Paths
    basePath: getBasePath(),
    
    // API
    api: API_CONFIG,
    
    // Features
    features: {
        // En producción, algunas features pueden estar deshabilitadas
        enableDatabase: !isGitHubPages, // GitHub Pages no puede usar el servidor local
        enableManim: !isGitHubPages,
        enableSwagger: !isProduction
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = APP_CONFIG;
} else {
    // Browser
    window.APP_CONFIG = APP_CONFIG;
}

