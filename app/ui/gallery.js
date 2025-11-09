// Manejo de la galería de artefactos

// Cargar galería desde la base de datos
async function loadGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) {
        return;
    }
    
    if (!window.ApiClient || !window.ApiClient.isDatabaseEnabled()) {
        gallery.innerHTML = '<h3>Galería</h3><p style="color: #888; font-size: 12px;">No disponible en GitHub Pages. Se requiere un servidor de API.</p>';
        return;
    }
    
    try {
        const arts = await window.ApiClient.getAllArtworks();
        displayGallery(arts);
    } catch (error) {
        console.error('Error cargando galería:', error);
        gallery.innerHTML = '<h3>Galería</h3><p style="color: #888; font-size: 12px;">No disponible. Se requiere un servidor de API.</p>';
    }
}

// Mostrar galería de artefactos
function displayGallery(arts) {
    const gallery = document.getElementById('gallery');
    if (!gallery) {
        return;
    }
    
    gallery.innerHTML = '<h3>Galería</h3>';
    
    arts.slice(-10).reverse().forEach(art => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <h4>${art.type}</h4>
            <p>${new Date(art.timestamp).toLocaleString()}</p>
        `;
        item.addEventListener('click', () => {
            if (window.ArtLoader && window.ArtLoader.loadArt) {
                window.ArtLoader.loadArt(art);
            }
        });
        gallery.appendChild(item);
    });
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadGallery,
        displayGallery
    };
} else {
    window.Gallery = {
        loadGallery,
        displayGallery
    };
}

