// Cliente API para comunicación con el backend

// Obtener URL base de la API
function getApiBaseUrl() {
    if (typeof APP_CONFIG !== 'undefined') {
        return APP_CONFIG.api.baseURL;
    }
    
    // Fallback: detectar entorno manualmente
    const isProduction = window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1';
    return isProduction 
        ? window.location.origin + '/api'
        : 'http://localhost:3003/api';
}

// Verificar si la base de datos está disponible
function isDatabaseEnabled() {
    return typeof APP_CONFIG !== 'undefined' 
        ? APP_CONFIG.features.enableDatabase 
        : true; // Por defecto asumir que está disponible en desarrollo
}

// Realizar petición fetch con timeout
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Obtener todos los artefactos
async function getAllArtworks() {
    if (!isDatabaseEnabled()) {
        throw new Error('Database not available');
    }
    
    const response = await fetchWithTimeout(
        `${getApiBaseUrl()}/art`,
        {},
        5000
    );
    
    if (!response.ok) {
        throw new Error(`Error al cargar: ${response.status}`);
    }
    
    return await response.json();
}

// Guardar artefacto
async function saveArtwork(artData) {
    if (!isDatabaseEnabled()) {
        throw new Error('Database not available');
    }
    
    const response = await fetchWithTimeout(
        `${getApiBaseUrl()}/art`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artData)
        },
        10000
    );
    
    if (!response.ok) {
        throw new Error(`Error al guardar: ${response.status}`);
    }
    
    return await response.json();
}

// Manejar errores de API
function handleApiError(error, defaultMessage = 'Error de comunicación con el servidor') {
    if (error.name === 'AbortError') {
        return 'Timeout. Verifica que el servidor esté corriendo y accesible.';
    }
    
    if (error.message === 'Database not available') {
        return 'La funcionalidad no está disponible en GitHub Pages. Se requiere un servidor de API.';
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return 'Error de red. Asegúrate de que el servidor esté corriendo.';
    }
    
    return defaultMessage;
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getApiBaseUrl,
        isDatabaseEnabled,
        fetchWithTimeout,
        getAllArtworks,
        saveArtwork,
        handleApiError
    };
} else {
    window.ApiClient = {
        getApiBaseUrl,
        isDatabaseEnabled,
        fetchWithTimeout,
        getAllArtworks,
        saveArtwork,
        handleApiError
    };
}

