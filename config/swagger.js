const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3003;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Generative Data Art Engine API',
            version: '1.0.0',
            description: 'API para gestionar arte generativo, charts y presets',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Servidor de desarrollo'
            }
        ],
        tags: [
            { name: 'Artworks', description: 'Endpoints para gestionar obras de arte generativo' },
            { name: 'Charts', description: 'Endpoints para gestionar gráficos' },
            { name: 'Presets', description: 'Endpoints para gestionar presets de configuración' }
        ],
        components: {
            schemas: {
                Artwork: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del artefacto'
                        },
                        type: {
                            type: 'string',
                            description: 'Tipo de arte (fractal, mandala, etc.)'
                        },
                        parameters: {
                            type: 'object',
                            description: 'Parámetros de configuración del arte'
                        },
                        imageData: {
                            type: 'string',
                            description: 'Datos de la imagen en base64'
                        },
                        canvasSize: {
                            type: 'object',
                            properties: {
                                width: { type: 'integer' },
                                height: { type: 'integer' }
                            }
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                ArtworkInput: {
                    type: 'object',
                    required: ['type', 'parameters'],
                    properties: {
                        type: {
                            type: 'string',
                            description: 'Tipo de arte'
                        },
                        parameters: {
                            type: 'object',
                            description: 'Parámetros de configuración'
                        },
                        imageData: {
                            type: 'string',
                            description: 'Datos de imagen en base64 (opcional)'
                        },
                        canvasSize: {
                            type: 'object',
                            properties: {
                                width: { type: 'integer' },
                                height: { type: 'integer' }
                            }
                        }
                    }
                },
                Chart: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        type: {
                            type: 'string',
                            description: 'Tipo de chart (bar, line, pie, etc.)'
                        },
                        config: {
                            type: 'object',
                            description: 'Configuración del chart'
                        },
                        data: {
                            type: 'array',
                            description: 'Datos del chart'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                ChartInput: {
                    type: 'object',
                    required: ['name', 'type', 'config'],
                    properties: {
                        name: { type: 'string' },
                        type: { type: 'string' },
                        config: { type: 'object' },
                        data: { type: 'array' }
                    }
                },
                Preset: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        artType: {
                            type: 'string',
                            description: 'Tipo de arte para el preset'
                        },
                        parameters: {
                            type: 'object',
                            description: 'Parámetros guardados'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                PresetInput: {
                    type: 'object',
                    required: ['name', 'artType', 'parameters'],
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' },
                        artType: { type: 'string' },
                        parameters: { type: 'object' }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;

