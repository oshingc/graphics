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

### Desarrollo Local

```bash
npm start
```

O en modo desarrollo con auto-reload:

```bash
npm run dev
```

### Acceder a la aplicación

Abre tu navegador en `http://localhost:3003`

### Producción / GitHub Pages

La aplicación está configurada para funcionar en GitHub Pages. La configuración de entorno se detecta automáticamente.

**Nota**: Para usar la funcionalidad de base de datos en producción, necesitarás configurar un servidor de API separado y actualizar la URL en `config/env.js`.

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
├── config/                 # Configuración
│   ├── env.js             # Configuración de entorno
│   └── swagger.js          # Configuración de Swagger
├── db/                     # Capa de datos
│   ├── database.js        # Conexión a base de datos
│   ├── artworks.repository.js
│   ├── charts.repository.js
│   └── presets.repository.js
├── services/               # Lógica de negocio
│   ├── artworks.service.js
│   ├── charts.service.js
│   ├── presets.service.js
│   └── manim.service.js
├── routes/                 # Rutas de la API
│   ├── artworks.routes.js
│   ├── charts.routes.js
│   └── presets.routes.js
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

### Documentación Swagger

La documentación completa de la API está disponible en:
- Desarrollo: `http://localhost:3003/api-docs`
- Producción: `{your-domain}/api-docs`

### Endpoints principales

#### Artworks
- `GET /api/art` - Obtener todos los artefactos
- `GET /api/art/:id` - Obtener un artefacto específico
- `POST /api/art` - Crear un nuevo artefacto
- `PUT /api/art/:id` - Actualizar un artefacto
- `DELETE /api/art/:id` - Eliminar un artefacto
- `POST /api/art/:id/manim` - Generar animación Manim

#### Charts
- `GET /api/charts` - Obtener todos los charts
- `GET /api/charts/:id` - Obtener un chart específico
- `POST /api/charts` - Crear un nuevo chart
- `PUT /api/charts/:id` - Actualizar un chart
- `DELETE /api/charts/:id` - Eliminar un chart

#### Presets
- `GET /api/presets` - Obtener todos los presets
- `GET /api/presets/:id` - Obtener un preset específico
- `POST /api/presets` - Crear un nuevo preset
- `PUT /api/presets/:id` - Actualizar un preset
- `DELETE /api/presets/:id` - Eliminar un preset

## Deployment

### GitHub Pages

1. Habilita GitHub Pages en la configuración del repositorio
2. Selecciona la rama `main` y la carpeta raíz
3. El workflow de GitHub Actions se ejecutará automáticamente

### Configuración de Producción

Para usar la funcionalidad de base de datos en producción:

1. Configura un servidor de API (puedes usar el mismo `server.js` en un servicio como Heroku, Railway, etc.)
2. Actualiza la URL de la API en `config/env.js`:

```javascript
baseURL: 'https://your-api-server.com/api'
```

## Uso de Manim

Para generar animaciones con Manim desde un artefacto guardado:

1. Guarda un artefacto en la base de datos
2. Haz una petición POST a `/api/art/:id/manim`
3. La animación se generará y guardará en `manim_output/`

## Cypress.io
<img width="1711" height="862" alt="image" src="https://github.com/user-attachments/assets/d9090bc7-3011-48cb-9ffc-b9a18c2d5eb7" />


## Licencia

MIT
