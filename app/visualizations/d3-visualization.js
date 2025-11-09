// Visualización de estadísticas usando D3.js

async function createD3Visualization() {
    const container = d3.select('#d3Container');
    if (!container.node()) {
        return;
    }
    
    container.selectAll('*').remove();
    
    // Verificar si la base de datos está disponible
    if (!window.ApiClient || !window.ApiClient.isDatabaseEnabled()) {
        container.append('div')
            .style('color', '#888')
            .style('padding', '20px')
            .style('text-align', 'center')
            .style('font-size', '14px')
            .html('Las estadísticas no están disponibles en GitHub Pages.<br>Se requiere un servidor de API para esta funcionalidad.');
        return;
    }
    
    try {
        const arts = await window.ApiClient.getAllArtworks();
        
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
        
        renderChart(container, data);
        
    } catch (error) {
        console.error('Error creando visualización D3:', error);
        container.selectAll('*').remove();
        
        const isNetworkError = error.name === 'AbortError' || 
                              error.message.includes('Failed to fetch') ||
                              error.message.includes('NetworkError');
        
        const isGitHubPages = typeof APP_CONFIG !== 'undefined' && APP_CONFIG.isGitHubPages;
        
        if (isNetworkError || isGitHubPages) {
            container.append('div')
                .style('color', '#888')
                .style('padding', '20px')
                .style('text-align', 'center')
                .style('font-size', '14px')
                .html('Las estadísticas no están disponibles.<br>Se requiere un servidor de API para esta funcionalidad.');
        } else {
            container.append('div')
                .style('color', '#ff6b6b')
                .style('padding', '20px')
                .style('text-align', 'center')
                .style('font-size', '14px')
                .text('Error al cargar visualización. Verifica que el servidor esté corriendo.');
        }
    }
}

function renderChart(container, data) {
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
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createD3Visualization
    };
} else {
    window.D3Visualization = {
        createD3Visualization
    };
}

