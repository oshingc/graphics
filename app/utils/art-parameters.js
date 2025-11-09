// Utilidades para obtener y manejar parámetros de arte

// Obtener parámetros actuales del formulario
function getCurrentParameters() {
    const artType = document.getElementById('artType').value;
    const params = {
        artType: artType,
        colors: {
            background: document.getElementById('bgColor').value,
            primary: document.getElementById('primaryColor').value,
            secondary: document.getElementById('secondaryColor').value
        },
        canvasSize: {
            width: parseInt(document.getElementById('canvasWidth').value),
            height: parseInt(document.getElementById('canvasHeight').value)
        }
    };
    
    // Parámetros específicos por tipo
    switch(artType) {
        case 'fractal':
            params.fractal = {
                iterations: parseInt(document.getElementById('fractalIterations').value),
                angle: parseInt(document.getElementById('fractalAngle').value),
                length: parseInt(document.getElementById('fractalLength').value)
            };
            break;
        case 'mandala':
            params.mandala = {
                segments: parseInt(document.getElementById('mandalaSegments').value),
                radius: parseInt(document.getElementById('mandalaRadius').value),
                layers: parseInt(document.getElementById('mandalaLayers').value)
            };
            break;
        case 'vectorField':
            params.vectorField = {
                density: parseInt(document.getElementById('vectorDensity').value),
                scale: parseFloat(document.getElementById('vectorScale').value),
                force: parseFloat(document.getElementById('vectorForce').value)
            };
            break;
        case 'particles':
            params.particles = {
                count: parseInt(document.getElementById('particleCount').value),
                speed: parseFloat(document.getElementById('particleSpeed').value),
                gravity: parseFloat(document.getElementById('particleGravity').value)
            };
            break;
        case 'perlin':
            params.perlin = {
                scale: parseFloat(document.getElementById('perlinScale').value),
                speed: parseFloat(document.getElementById('perlinSpeed').value),
                detail: parseInt(document.getElementById('perlinDetail').value)
            };
            break;
        case 'mathematical':
            params.mathematical = {
                type: document.getElementById('mathType').value,
                paramA: parseInt(document.getElementById('mathParamA').value),
                paramB: parseInt(document.getElementById('mathParamB').value)
            };
            break;
        case 'tensions':
            params.tensions = {
                nodes: parseInt(document.getElementById('tensionsNodes').value),
                force: parseFloat(document.getElementById('tensionsForce').value),
                minDist: parseFloat(document.getElementById('tensionsMinDist').value),
                maxDist: parseFloat(document.getElementById('tensionsMaxDist').value),
                thickness: parseFloat(document.getElementById('tensionsThickness').value),
                animate: document.getElementById('tensionsAnimate').checked
            };
            break;
        case 'musicalTensions':
            params.musicalTensions = {
                root: document.getElementById('musicalRoot').value,
                chordQuality: document.getElementById('musicalChordQuality').value,
                mode: document.getElementById('musicalMode').value,
                tensionsShow: document.getElementById('musicalTensionsShow').value,
                noteSpacing: parseFloat(document.getElementById('musicalNoteSpacing').value),
                circleRadius: parseFloat(document.getElementById('musicalCircleRadius').value),
                lineThickness: parseFloat(document.getElementById('musicalLineThickness').value),
                showNames: document.getElementById('musicalShowNames').checked,
                animate: document.getElementById('musicalAnimate').checked
            };
            break;
    }
    
    return params;
}

// Mapeo de nombres de parámetros a IDs de elementos por tipo
const PARAM_ID_MAPS = {
    fractal: {
        iterations: 'fractalIterations',
        angle: 'fractalAngle',
        length: 'fractalLength'
    },
    mandala: {
        segments: 'mandalaSegments',
        radius: 'mandalaRadius',
        layers: 'mandalaLayers'
    },
    vectorField: {
        density: 'vectorDensity',
        scale: 'vectorScale',
        force: 'vectorForce'
    },
    particles: {
        count: 'particleCount',
        speed: 'particleSpeed',
        gravity: 'particleGravity'
    },
    perlin: {
        scale: 'perlinScale',
        speed: 'perlinSpeed',
        detail: 'perlinDetail'
    },
    mathematical: {
        type: 'mathType',
        paramA: 'mathParamA',
        paramB: 'mathParamB'
    },
    tensions: {
        nodes: 'tensionsNodes',
        force: 'tensionsForce',
        minDist: 'tensionsMinDist',
        maxDist: 'tensionsMaxDist',
        thickness: 'tensionsThickness',
        animate: 'tensionsAnimate'
    },
    musicalTensions: {
        root: 'musicalRoot',
        chordQuality: 'musicalChordQuality',
        mode: 'musicalMode',
        tensionsShow: 'musicalTensionsShow',
        noteSpacing: 'musicalNoteSpacing',
        circleRadius: 'musicalCircleRadius',
        lineThickness: 'musicalLineThickness',
        showNames: 'musicalShowNames',
        animate: 'musicalAnimate'
    }
};

// Restaurar parámetros desde un objeto de arte
function restoreParameters(art) {
    // Restaurar tipo de arte
    document.getElementById('artType').value = art.type;
    
    // Restaurar colores
    if (art.parameters.colors) {
        document.getElementById('bgColor').value = art.parameters.colors.background;
        document.getElementById('primaryColor').value = art.parameters.colors.primary;
        document.getElementById('secondaryColor').value = art.parameters.colors.secondary;
    }
    
    // Restaurar tamaño del canvas
    if (art.parameters.canvasSize) {
        document.getElementById('canvasWidth').value = art.parameters.canvasSize.width;
        document.getElementById('canvasHeight').value = art.parameters.canvasSize.height;
    }
    
    // Restaurar parámetros específicos del tipo
    const params = art.parameters[art.type];
    if (params && PARAM_ID_MAPS[art.type]) {
        const idMap = PARAM_ID_MAPS[art.type];
        Object.keys(params).forEach(key => {
            const elementId = idMap[key];
            if (elementId) {
                const element = document.getElementById(elementId);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = params[key];
                    } else {
                        element.value = params[key];
                    }
                }
            }
        });
    }
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentParameters,
        restoreParameters
    };
} else {
    window.ArtParameters = {
        getCurrentParameters,
        restoreParameters
    };
}

