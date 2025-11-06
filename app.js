// Aplicación principal - Manejo de formularios, API, y almacenamiento

const API_BASE_URL = 'http://localhost:3003/api';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateParamVisibility();
    loadGallery();
});

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('artType').addEventListener('change', updateParamVisibility);
    document.getElementById('generateBtn').addEventListener('click', generateArt);
    document.getElementById('saveBtn').addEventListener('click', saveArtToDatabase);
    document.getElementById('loadBtn').addEventListener('click', loadArtFromDatabase);
    document.getElementById('exportBtn').addEventListener('click', exportAsPNG);
    document.getElementById('exportHighQualityBtn').addEventListener('click', exportHighQuality);
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
    try {
        const canvas = document.getElementById('processingCanvas');
        const imageData = canvas.toDataURL('image/png');
        
        const artData = {
            type: document.getElementById('artType').value,
            parameters: getCurrentParameters(),
            imageData: imageData,
            timestamp: new Date().toISOString(),
            canvasSize: {
                width: parseInt(document.getElementById('canvasWidth').value),
                height: parseInt(document.getElementById('canvasHeight').value)
            }
        };
        
        const response = await fetch(`${API_BASE_URL}/art`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artData)
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`Arte guardado con ID: ${result.id}`);
            loadGallery();
            createD3Visualization(); // Actualizar estadísticas
        } else {
            throw new Error('Error al guardar');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar el arte. Asegúrate de que el servidor esté corriendo.');
    }
}

// Obtener parámetros actuales
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

// Cargar arte desde base de datos
async function loadArtFromDatabase() {
    try {
        const response = await fetch(`${API_BASE_URL}/art`);
        if (response.ok) {
            const arts = await response.json();
            displayArtList(arts);
        } else {
            throw new Error('Error al cargar');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el arte. Asegúrate de que el servidor esté corriendo.');
    }
}

async function loadGallery() {
    try {
        const response = await fetch(`${API_BASE_URL}/art`);
        if (response.ok) {
            const arts = await response.json();
            displayGallery(arts);
        }
    } catch (error) {
        console.error('Error cargando galería:', error);
    }
}

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

function loadArt(art) {
    document.getElementById('artType').value = art.type;
    updateParamVisibility();
    
    if (art.parameters.colors) {
        document.getElementById('bgColor').value = art.parameters.colors.background;
        document.getElementById('primaryColor').value = art.parameters.colors.primary;
        document.getElementById('secondaryColor').value = art.parameters.colors.secondary;
    }
    
    if (art.parameters.canvasSize) {
        document.getElementById('canvasWidth').value = art.parameters.canvasSize.width;
        document.getElementById('canvasHeight').value = art.parameters.canvasSize.height;
    }
    
    // Restaurar parámetros específicos del tipo
    const params = art.parameters[art.type];
    if (params) {
        Object.keys(params).forEach(key => {
            // Mapear nombres de parámetros a IDs de elementos
            let elementId;
            if (art.type === 'fractal') {
                const idMap = { iterations: 'fractalIterations', angle: 'fractalAngle', length: 'fractalLength' };
                elementId = idMap[key];
            } else if (art.type === 'mandala') {
                const idMap = { segments: 'mandalaSegments', radius: 'mandalaRadius', layers: 'mandalaLayers' };
                elementId = idMap[key];
            } else if (art.type === 'vectorField') {
                const idMap = { density: 'vectorDensity', scale: 'vectorScale', force: 'vectorForce' };
                elementId = idMap[key];
            } else if (art.type === 'particles') {
                const idMap = { count: 'particleCount', speed: 'particleSpeed', gravity: 'particleGravity' };
                elementId = idMap[key];
            } else if (art.type === 'perlin') {
                const idMap = { scale: 'perlinScale', speed: 'perlinSpeed', detail: 'perlinDetail' };
                elementId = idMap[key];
            } else if (art.type === 'mathematical') {
                const idMap = { type: 'mathType', paramA: 'mathParamA', paramB: 'mathParamB' };
                elementId = idMap[key];
            } else if (art.type === 'tensions') {
                const idMap = { 
                    nodes: 'tensionsNodes', 
                    force: 'tensionsForce', 
                    minDist: 'tensionsMinDist', 
                    maxDist: 'tensionsMaxDist', 
                    thickness: 'tensionsThickness',
                    animate: 'tensionsAnimate'
                };
                elementId = idMap[key];
            } else if (art.type === 'musicalTensions') {
                const idMap = { 
                    root: 'musicalRoot',
                    chordQuality: 'musicalChordQuality',
                    mode: 'musicalMode',
                    tensionsShow: 'musicalTensionsShow',
                    noteSpacing: 'musicalNoteSpacing',
                    circleRadius: 'musicalCircleRadius',
                    lineThickness: 'musicalLineThickness',
                    showNames: 'musicalShowNames',
                    animate: 'musicalAnimate'
                };
                elementId = idMap[key];
            }
            
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
    
    generateArt();
}

function displayGallery(arts) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<h3>Galería</h3>';
    
    arts.slice(-10).reverse().forEach(art => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <h4>${art.type}</h4>
            <p>${new Date(art.timestamp).toLocaleString()}</p>
        `;
        item.addEventListener('click', () => loadArt(art));
        gallery.appendChild(item);
    });
}

// Exportar como PNG (resolución normal)
function exportAsPNG() {
    const canvas = document.getElementById('processingCanvas');
    const link = document.createElement('a');
    link.download = `generative-art-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Exportar en alta calidad con multiplicador de resolución
async function exportHighQuality() {
    try {
        const multiplier = parseInt(document.getElementById('exportMultiplier').value) || 2;
        const sourceCanvas = document.getElementById('processingCanvas');
        
        if (!sourceCanvas) {
            alert('No hay canvas para exportar. Primero genera un arte.');
            return;
        }
        
        // Obtener dimensiones actuales del canvas
        const currentWidth = sourceCanvas.width;
        const currentHeight = sourceCanvas.height;
        
        // Calcular dimensiones de alta resolución
        const highResWidth = currentWidth * multiplier;
        const highResHeight = currentHeight * multiplier;
        
        // Mostrar mensaje de procesamiento
        const processingMsg = document.createElement('div');
        processingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #333; padding: 20px; border: 2px solid #fff; z-index: 10000; color: #fff; text-align: center;';
        processingMsg.innerHTML = `Generando imagen de alta calidad...<br>${highResWidth}x${highResHeight}px`;
        document.body.appendChild(processingMsg);
        
        // Esperar un frame para que se muestre el mensaje
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Crear canvas temporal de alta resolución
        const highResCanvas = document.createElement('canvas');
        highResCanvas.width = highResWidth;
        highResCanvas.height = highResHeight;
        const ctx = highResCanvas.getContext('2d');
        
        // Configurar calidad de renderizado
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Para mejor calidad, necesitamos regenerar a alta resolución
        // Primero intentamos renderizar directamente en alta resolución
        const originalWidth = document.getElementById('canvasWidth').value;
        const originalHeight = document.getElementById('canvasHeight').value;
        
        // Establecer dimensiones de alta resolución temporalmente
        document.getElementById('canvasWidth').value = highResWidth;
        document.getElementById('canvasHeight').value = highResHeight;
        
        // Generar arte en alta resolución
        await new Promise((resolve) => {
            // Usar un timeout para dar tiempo a que Processing renderice
            setTimeout(() => {
                // Intentar obtener el canvas actualizado
                const updatedCanvas = document.getElementById('processingCanvas');
                
                // Si el canvas se actualizó, copiarlo; si no, escalar el existente
                if (updatedCanvas && updatedCanvas.width === highResWidth) {
                    ctx.drawImage(updatedCanvas, 0, 0);
                } else {
                    // Método alternativo: escalar con alta calidad
                    ctx.drawImage(sourceCanvas, 0, 0, highResWidth, highResHeight);
                }
                
                // Restaurar dimensiones originales
                document.getElementById('canvasWidth').value = originalWidth;
                document.getElementById('canvasHeight').value = originalHeight;
                
                // Regenerar arte en resolución original
                setTimeout(() => {
                    generateArt();
                    resolve();
                }, 500);
            }, 1000);
        });
        
        // Exportar
        const dataURL = highResCanvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = `generative-art-hq-${highResWidth}x${highResHeight}-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
        
        // Remover mensaje
        document.body.removeChild(processingMsg);
        
        alert(`Imagen de alta calidad exportada:\n${highResWidth}x${highResHeight}px\nMultiplicador: ${multiplier}x`);
        
    } catch (error) {
        console.error('Error exportando alta calidad:', error);
        alert('Error al exportar imagen de alta calidad: ' + error.message);
    }
}


// Integración con D3.js - Visualización de estadísticas de arte
async function createD3Visualization() {
    try {
        // Obtener datos de artefactos guardados
        const response = await fetch(`${API_BASE_URL}/art`);
        if (!response.ok) {
            throw new Error('Error al cargar datos');
        }
        
        const arts = await response.json();
        
        const container = d3.select('#d3Container');
        container.selectAll('*').remove();
        
        if (arts.length === 0) {
            container.append('div')
                .style('color', '#fff')
                .style('padding', '20px')
                .style('text-align', 'center')
                .text('No hay artefactos guardados aún');
            return;
        }
        
        // Contar artefactos por tipo
        const typeCount = {};
        arts.forEach(art => {
            typeCount[art.type] = (typeCount[art.type] || 0) + 1;
        });
        
        const data = Object.entries(typeCount).map(([type, count]) => ({
            type: type,
            count: count
        }));
        
        const width = 800;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 60, left: 40 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Escalas
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.type))
            .range([0, chartWidth])
            .padding(0.2);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .nice()
            .range([chartHeight, 0]);
        
        // Colores
        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.type))
            .range(d3.schemeCategory10);
        
        // Barras
        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.type))
            .attr('y', d => yScale(d.count))
            .attr('width', xScale.bandwidth())
            .attr('height', d => chartHeight - yScale(d.count))
            .attr('fill', d => colorScale(d.type))
            .attr('opacity', 0.8)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('opacity', 1)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 2);
                
                // Tooltip
                const tooltip = g.append('g')
                    .attr('class', 'tooltip')
                    .attr('transform', `translate(${xScale(d.type) + xScale.bandwidth() / 2}, ${yScale(d.count) - 10})`);
                
                tooltip.append('rect')
                    .attr('x', -30)
                    .attr('y', -20)
                    .attr('width', 60)
                    .attr('height', 20)
                    .attr('fill', '#333')
                    .attr('rx', 4);
                
                tooltip.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', -5)
                    .attr('fill', '#fff')
                    .attr('font-size', '12px')
                    .text(`${d.count}`);
            })
            .on('mouseout', function() {
                d3.select(this)
                    .attr('opacity', 0.8)
                    .attr('stroke', null)
                    .attr('stroke-width', null);
                
                g.selectAll('.tooltip').remove();
            });
        
        // Eje X
        g.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('fill', '#fff')
            .attr('transform', 'rotate(-45)')
            .attr('text-anchor', 'end')
            .style('font-size', '10px');
        
        // Eje Y
        g.append('g')
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll('text')
            .attr('fill', '#fff')
            .style('font-size', '10px');
        
        // Líneas del eje
        g.selectAll('.domain, .tick line')
            .attr('stroke', '#666');
        
        // Título
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text('Artefactos por Tipo');
        
    } catch (error) {
        console.error('Error creando visualización D3:', error);
        const container = d3.select('#d3Container');
        container.selectAll('*').remove();
        container.append('div')
            .style('color', '#ff0000')
            .style('padding', '20px')
            .style('text-align', 'center')
            .text('Error al cargar visualización');
    }
}

// Integración con G6.js para visualización de grafos
function createG6Visualization() {
    const container = document.getElementById('g6Container');
    container.innerHTML = '';
    
    const data = {
        nodes: [
            { id: 'node1', label: 'Fractal' },
            { id: 'node2', label: 'Mandala' },
            { id: 'node3', label: 'Vector Field' },
            { id: 'node4', label: 'Particles' },
            { id: 'node5', label: 'Perlin' },
            { id: 'node6', label: 'Mathematical' }
        ],
        edges: [
            { source: 'node1', target: 'node2' },
            { source: 'node2', target: 'node3' },
            { source: 'node3', target: 'node4' },
            { source: 'node4', target: 'node5' },
            { source: 'node5', target: 'node6' }
        ]
    };
    
    const graph = new G6.Graph({
        container: 'g6Container',
        width: 800,
        height: 300,
        modes: {
            default: ['drag-canvas', 'zoom-canvas']
        },
        defaultNode: {
            size: 30,
            style: {
                fill: '#fff',
                stroke: '#000'
            }
        },
        defaultEdge: {
            style: {
                stroke: '#fff'
            }
        }
    });
    
    graph.data(data);
    graph.render();
}

// Inicializar visualizaciones adicionales
setTimeout(() => {
    createD3Visualization();
    createG6Visualization();
}, 1000);

