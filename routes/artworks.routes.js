const express = require('express');
const router = express.Router();
const service = require('../services/artworks.service');
const manimService = require('../services/manim.service');

/**
 * @swagger
 * /api/art:
 *   get:
 *     summary: Obtener todos los artefactos
 *     tags: [Artworks]
 *     responses:
 *       200:
 *         description: Lista de artefactos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artwork'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
    try {
        const artworks = await service.getAll();
        res.json(artworks);
    } catch (err) {
        console.error('Error obteniendo artefactos:', err);
        res.status(500).json({ error: 'Error al obtener artefactos' });
    }
});

/**
 * @swagger
 * /api/art/{id}:
 *   get:
 *     summary: Obtener un artefacto específico
 *     tags: [Artworks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artefacto
 *     responses:
 *       200:
 *         description: Artefacto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artwork'
 *       404:
 *         description: Artefacto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
    try {
        const artwork = await service.getById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ error: 'Artefacto no encontrado' });
        }
        res.json(artwork);
    } catch (err) {
        console.error('Error obteniendo artefacto:', err);
        res.status(500).json({ error: 'Error al obtener artefacto' });
    }
});

/**
 * @swagger
 * /api/art:
 *   post:
 *     summary: Crear un nuevo artefacto
 *     tags: [Artworks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArtworkInput'
 *     responses:
 *       200:
 *         description: Artefacto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
    try {
        const { type, parameters, imageData, canvasSize } = req.body;
        
        if (!type || !parameters) {
            return res.status(400).json({ error: 'Tipo y parámetros son requeridos' });
        }
        
        const id = await service.create({ type, parameters, imageData, canvasSize });
        res.json({ 
            id,
            message: 'Artefacto guardado exitosamente'
        });
    } catch (err) {
        console.error('Error creando artefacto:', err);
        res.status(500).json({ error: 'Error al guardar artefacto' });
    }
});

/**
 * @swagger
 * /api/art/{id}:
 *   put:
 *     summary: Actualizar un artefacto
 *     tags: [Artworks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artefacto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArtworkInput'
 *     responses:
 *       200:
 *         description: Artefacto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Artefacto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', async (req, res) => {
    try {
        const { type, parameters, imageData, canvasSize } = req.body;
        
        if (!type || !parameters) {
            return res.status(400).json({ error: 'Tipo y parámetros son requeridos' });
        }
        
        const success = await service.update(req.params.id, { type, parameters, imageData, canvasSize });
        if (!success) {
            return res.status(404).json({ error: 'Artefacto no encontrado' });
        }
        
        res.json({ 
            id: req.params.id,
            message: 'Artefacto actualizado exitosamente'
        });
    } catch (err) {
        console.error('Error actualizando artefacto:', err);
        res.status(500).json({ error: 'Error al actualizar artefacto' });
    }
});

/**
 * @swagger
 * /api/art/{id}:
 *   delete:
 *     summary: Eliminar un artefacto
 *     tags: [Artworks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artefacto
 *     responses:
 *       200:
 *         description: Artefacto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Artefacto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', async (req, res) => {
    try {
        const success = await service.deleteById(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Artefacto no encontrado' });
        }
        res.json({ message: 'Artefacto eliminado exitosamente' });
    } catch (err) {
        console.error('Error eliminando artefacto:', err);
        res.status(500).json({ error: 'Error al eliminar artefacto' });
    }
});

/**
 * @swagger
 * /api/art/{id}/manim:
 *   post:
 *     summary: Generar animación Manim para un artefacto
 *     tags: [Artworks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artefacto
 *     responses:
 *       200:
 *         description: Animación generada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 outputPath:
 *                   type: string
 *       404:
 *         description: Artefacto no encontrado
 *       500:
 *         description: Error al generar animación
 */
router.post('/:id/manim', async (req, res) => {
    try {
        const artwork = await service.getById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ error: 'Artefacto no encontrado' });
        }
        
        const result = await manimService.generateAnimation(artwork.parameters);
        res.json({ 
            message: 'Animación Manim generada',
            outputPath: result
        });
    } catch (error) {
        console.error('Error generando Manim:', error);
        res.status(500).json({ error: 'Error al generar animación Manim' });
    }
});

module.exports = router;
