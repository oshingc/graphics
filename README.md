# Generative Data Art Engine

Motor de arte generativo de datos que utiliza Processing.js, D3.js, G6.js y Manim (Python) para generar visualizaciones de alta calidad.

## Características

- **Processing.js**: Genera arte generativo en tiempo real
  - Fractales
  - Mandalas
  - Campos vectoriales
  - Simulaciones de partículas
  - Perlin Noise
  - Formas matemáticas

- **Almacenamiento**: Base de datos SQLite para guardar gráficos y parámetros

- **API REST**: Endpoints para guardar, cargar y gestionar artefactos

- **Integración con librerías**:
  - D3.js para visualizaciones adicionales
  - G6.js para visualización de grafos
  - Manim (Python) para renderizado avanzado y animaciones

## Instalación

### Requisitos

- Node.js (v14 o superior)
- Python 3.8 o superior
- npm

### Instalación de dependencias Node.js

```bash
npm install
```

### Instalación de dependencias Python

```bash
pip3 install -r requirements.txt
```

**Nota**: La instalación de Manim puede requerir dependencias adicionales del sistema. Consulta la [documentación oficial de Manim](https://docs.manim.community/) para más detalles.

## Uso

### Iniciar el servidor

```bash
npm start
```

O en modo desarrollo con auto-reload:

```bash
npm run dev
```

### Acceder a la aplicación

Abre tu navegador en `http://localhost:3003`

## Pruebas E2E con Cypress

### Instalación

Las dependencias de Cypress se instalan automáticamente con `npm install`.

### Ejecutar pruebas

**Abrir Cypress en modo interactivo:**
```bash
npm run cypress:open
```

**Ejecutar pruebas en modo headless:**
```bash
npm run cypress:run
```

**Ejecutar pruebas e2e (alias):**
```bash
npm run test:e2e
```

### Requisitos

Antes de ejecutar las pruebas, asegúrate de que el servidor esté corriendo:

```bash
npm start
```

Las pruebas se ejecutan contra `http://localhost:3003` por defecto.

### Estructura de pruebas

Las pruebas e2e están organizadas en:
- `cypress/e2e/app.cy.js` - Pruebas principales de la aplicación
  - Navegación y UI básica
  - Generación de todos los tipos de arte
  - Guardar y cargar artefactos
  - API endpoints
  - Controles y parámetros

### Configuración

La configuración de Cypress está en `cypress.config.js`:
- Base URL: `http://localhost:3003`
- Viewport: 1280x720
- Timeout por defecto: 10 segundos

## Estructura del Proyecto

```
graphics/
├── index.html              # Interfaz principal HTML
├── styles.css              # Estilos CSS
├── app.js                  # Lógica principal de la aplicación
├── processing-art.js       # Sketches de Processing.js
├── server.js               # Servidor Express y API
├── manim_generator.py      # Generador de animaciones Manim
├── package.json            # Dependencias Node.js
├── requirements.txt        # Dependencias Python
├── artworks.db             # Base de datos SQLite (se crea automáticamente)
├── cypress/                # Pruebas E2E con Cypress
│   ├── e2e/
│   │   └── app.cy.js       # Pruebas principales
│   ├── support/
│   │   ├── commands.js     # Comandos personalizados
│   │   └── e2e.js          # Configuración de soporte
│   └── fixtures/           # Datos de prueba (opcional)
└── cypress.config.js       # Configuración de Cypress
```

## API Endpoints

### GET /api/art
Obtiene todos los artefactos guardados.

### GET /api/art/:id
Obtiene un artefacto específico por ID.

### POST /api/art
Guarda un nuevo artefacto. Body:
```json
{
  "type": "fractal",
  "parameters": {...},
  "imageData": "data:image/png;base64,...",
  "canvasSize": {"width": 800, "height": 600}
}
```

### DELETE /api/art/:id
Elimina un artefacto por ID.

### POST /api/art/:id/manim
Genera una animación Manim para un artefacto específico.

## Uso de Manim

Para generar animaciones con Manim desde un artefacto guardado:

1. Guarda un artefacto en la base de datos
2. Usa el endpoint `/api/art/:id/manim` o ejecuta directamente:

```bash
python3 manim_generator.py params.json
```

## Notas

- La aplicación está diseñada para renderizar gráficos de alta calidad, no para diseño responsive o interfaces visualmente atractivas.
- Los gráficos se almacenan como datos base64 en la base de datos.
- Manim requiere instalación adicional y puede tardar en renderizar animaciones.

