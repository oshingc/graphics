// Aplicación principal - Coordinación de módulos

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateParamVisibility();
    setupDatabaseFeatures();
    
    // Cargar galería si la base de datos está disponible
    if (window.ApiClient && window.ApiClient.isDatabaseEnabled()) {
        if (window.Gallery && window.Gallery.loadGallery) {
            window.Gallery.loadGallery();
        }
    }
});

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('artType').addEventListener('change', updateParamVisibility);
    document.getElementById('generateBtn').addEventListener('click', generateArt);
    
    // Botones de base de datos
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveArtToDatabase);
    }
    
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            if (window.ArtLoader && window.ArtLoader.loadArtFromDatabase) {
                window.ArtLoader.loadArtFromDatabase();
            }
        });
    }
    
    // Botones de exportación
    const exportBtn = document.getElementById('exportBtn');
    const exportHighQualityBtn = document.getElementById('exportHighQualityBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (window.Export && window.Export.exportAsPNG) {
                window.Export.exportAsPNG();
            }
        });
    }
    
    if (exportHighQualityBtn) {
        exportHighQualityBtn.addEventListener('click', () => {
            if (window.Export && window.Export.exportHighQuality) {
                window.Export.exportHighQuality();
            }
        });
    }
}

// Configurar características de base de datos
function setupDatabaseFeatures() {
    const isDatabaseEnabled = window.ApiClient && window.ApiClient.isDatabaseEnabled();
    
    // Deshabilitar botones que requieren backend si no está disponible
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    
    if (!isDatabaseEnabled) {
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.title = 'Funcionalidad no disponible en GitHub Pages. Se requiere un servidor de API.';
        }
        if (loadBtn) {
            loadBtn.disabled = true;
            loadBtn.title = 'Funcionalidad no disponible en GitHub Pages. Se requiere un servidor de API.';
        }
    }
}

// Actualizar visibilidad de parámetros según el tipo de arte
function updateParamVisibility() {
    const artType = document.getElementById('artType').value;
    const paramGroups = document.querySelectorAll('.param-group');
    
    paramGroups.forEach(group => {
        group.style.display = 'none';
    });
    
    const targetGroup = document.getElementById(artType + 'Params');
    if (targetGroup) {
        targetGroup.style.display = 'block';
    }
}

// Guardar arte en base de datos
async function saveArtToDatabase() {
    if (!window.ApiClient || !window.ApiClient.isDatabaseEnabled()) {
        alert('La funcionalidad de guardar no está disponible en GitHub Pages.\n\nPara usar esta función, necesitas:\n1. Configurar un servidor de API\n2. Actualizar la URL de la API en config/env.js');
        return;
    }
    
    try {
        const canvas = document.getElementById('processingCanvas');
        if (!canvas) {
            alert('No hay canvas para guardar. Primero genera un arte.');
            return;
        }
        
        const imageData = canvas.toDataURL('image/png');
        
        // Obtener parámetros actuales
        const parameters = window.ArtParameters && window.ArtParameters.getCurrentParameters
            ? window.ArtParameters.getCurrentParameters()
            : {};
        
        const artData = {
            type: document.getElementById('artType').value,
            parameters: parameters,
            imageData: imageData,
            timestamp: new Date().toISOString(),
            canvasSize: {
                width: parseInt(document.getElementById('canvasWidth').value),
                height: parseInt(document.getElementById('canvasHeight').value)
            }
        };
        
        const result = await window.ApiClient.saveArtwork(artData);
        alert(`Arte guardado con ID: ${result.id}`);
        
        // Actualizar galería y estadísticas
        if (window.Gallery && window.Gallery.loadGallery) {
            window.Gallery.loadGallery();
        }
        
        if (window.D3Visualization && window.D3Visualization.createD3Visualization) {
            window.D3Visualization.createD3Visualization();
        }
    } catch (error) {
        console.error('Error:', error);
        const message = window.ApiClient.handleApiError(error, 'Error al guardar el arte. Asegúrate de que el servidor esté corriendo.');
        alert(message);
    }
}

// Inicializar visualizaciones adicionales (solo si los contenedores existen)
setTimeout(() => {
    try {
        if (document.getElementById('d3Container') && window.D3Visualization && window.D3Visualization.createD3Visualization) {
            window.D3Visualization.createD3Visualization();
        }
        if (document.getElementById('g6Container') && window.G6Visualization && window.G6Visualization.createG6Visualization) {
            window.G6Visualization.createG6Visualization();
        }
    } catch (error) {
        console.warn('Error inicializando visualizaciones:', error);
    }
}, 1000);
