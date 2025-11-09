// Funciones de exportación de arte

// Exportar como PNG (resolución normal)
function exportAsPNG() {
    const canvas = document.getElementById('processingCanvas');
    if (!canvas) {
        alert('No hay canvas para exportar. Primero genera un arte.');
        return;
    }
    
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
        const originalWidth = document.getElementById('canvasWidth').value;
        const originalHeight = document.getElementById('canvasHeight').value;
        
        // Establecer dimensiones de alta resolución temporalmente
        document.getElementById('canvasWidth').value = highResWidth;
        document.getElementById('canvasHeight').value = highResHeight;
        
        // Generar arte en alta resolución
        await new Promise((resolve) => {
            setTimeout(() => {
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
                    if (typeof generateArt === 'function') {
                        generateArt();
                    }
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

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exportAsPNG,
        exportHighQuality
    };
} else {
    window.Export = {
        exportAsPNG,
        exportHighQuality
    };
}

