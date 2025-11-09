// Visualización de grafos usando G6.js

function createG6Visualization() {
    try {
        const container = document.getElementById('g6Container');
        if (!container) {
            console.warn('g6Container no encontrado');
            return;
        }
        
        // Verificar que G6 está disponible
        if (typeof G6 === 'undefined') {
            console.warn('G6.js no está disponible');
            return;
        }
        
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
        
        // G6 v5+ usa read() en lugar de data()
        if (typeof graph.read === 'function') {
            graph.read(data);
        } else if (typeof graph.data === 'function') {
            graph.data(data);
            graph.render();
        } else {
            // Fallback: pasar datos directamente en el constructor
            console.warn('Método de G6 no reconocido, intentando renderizar directamente');
            graph.render();
        }
    } catch (error) {
        console.error('Error creando visualización G6:', error);
    }
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createG6Visualization
    };
} else {
    window.G6Visualization = {
        createG6Visualization
    };
}

