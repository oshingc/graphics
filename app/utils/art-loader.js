// Utilidades para cargar y restaurar arte desde la base de datos

// Cargar arte desde la base de datos
async function loadArtFromDatabase() {
    if (!window.ApiClient || !window.ApiClient.isDatabaseEnabled()) {
        alert('La funcionalidad de cargar no está disponible en GitHub Pages.\n\nPara usar esta función, necesitas:\n1. Configurar un servidor de API\n2. Actualizar la URL de la API en config/env.js');
        return;
    }
    
    try {
        const arts = await window.ApiClient.getAllArtworks();
        displayArtList(arts);
    } catch (error) {
        console.error('Error:', error);
        const message = window.ApiClient.handleApiError(error, 'Error al cargar el arte. Asegúrate de que el servidor esté corriendo.');
        alert(message);
    }
}

// Mostrar lista de artefactos para selección
function displayArtList(arts) {
    if (arts.length === 0) {
        alert('No hay arte guardado en la base de datos.');
        return;
    }
    
    const artList = arts.map((art, index) => 
        `${index + 1}. ${art.type} - ${new Date(art.timestamp).toLocaleString()}`
    ).join('\n');
    
    const selection = prompt(`Selecciona un arte (1-${arts.length}):\n\n${artList}`);
    const index = parseInt(selection) - 1;
    
    if (index >= 0 && index < arts.length) {
        loadArt(arts[index]);
    }
}

// Cargar un artefacto específico
function loadArt(art) {
    // Restaurar parámetros
    if (window.ArtParameters) {
        window.ArtParameters.restoreParameters(art);
    }
    
    // Actualizar visibilidad de parámetros
    if (typeof updateParamVisibility === 'function') {
        updateParamVisibility();
    }
    
    // Regenerar arte
    if (typeof generateArt === 'function') {
        generateArt();
    }
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadArtFromDatabase,
        displayArtList,
        loadArt
    };
} else {
    window.ArtLoader = {
        loadArtFromDatabase,
        displayArtList,
        loadArt
    };
}

