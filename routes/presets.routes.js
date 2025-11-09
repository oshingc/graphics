const express = require('express');
const router = express.Router();
const service = require('../services/presets.service');

/**
 * @swagger
 * /api/presets:
 *   get:
 *     summary: Obtener todos los presets
 *     tags: [Presets]
 *     responses:
 *       200:
 *         description: Lista de presets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Preset'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
    try {
        const presets = await service.getAll();
        res.json(presets);
    } catch (err) {
        console.error('Error obteniendo presets:', err);
        res.status(500).json({ error: 'Error al obtener presets' });
    }
});

/**
 * @swagger
 * /api/presets/{id}:
 *   get:
 *     summary: Obtener un preset específico
 *     tags: [Presets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del preset
 *     responses:
 *       200:
 *         description: Preset encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Preset'
 *       404:
 *         description: Preset no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
    try {
        const preset = await service.getById(req.params.id);
        if (!preset) {
            return res.status(404).json({ error: 'Preset no encontrado' });
        }
        res.json(preset);
    } catch (err) {
        console.error('Error obteniendo preset:', err);
        res.status(500).json({ error: 'Error al obtener preset' });
    }
});

/**
 * @swagger
 * /api/presets:
 *   post:
 *     summary: Crear un nuevo preset
 *     tags: [Presets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PresetInput'
 *     responses:
 *       200:
 *         description: Preset creado exitosamente
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
        const { name, description, artType, parameters } = req.body;
        
        if (!name || !artType || !parameters) {
            return res.status(400).json({ error: 'Nombre, tipo de arte y parámetros son requeridos' });
        }
        
        const id = await service.create({ name, description, artType, parameters });
        res.json({ 
            id,
            message: 'Preset creado exitosamente'
        });
    } catch (err) {
        console.error('Error creando preset:', err);
        res.status(500).json({ error: 'Error al crear preset' });
    }
});

/**
 * @swagger
 * /api/presets/{id}:
 *   put:
 *     summary: Actualizar un preset
 *     tags: [Presets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del preset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PresetInput'
 *     responses:
 *       200:
 *         description: Preset actualizado exitosamente
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
 *         description: Preset no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', async (req, res) => {
    try {
        const { name, description, artType, parameters } = req.body;
        
        if (!name || !artType || !parameters) {
            return res.status(400).json({ error: 'Nombre, tipo de arte y parámetros son requeridos' });
        }
        
        const success = await service.update(req.params.id, { name, description, artType, parameters });
        if (!success) {
            return res.status(404).json({ error: 'Preset no encontrado' });
        }
        
        res.json({ 
            id: req.params.id,
            message: 'Preset actualizado exitosamente'
        });
    } catch (err) {
        console.error('Error actualizando preset:', err);
        res.status(500).json({ error: 'Error al actualizar preset' });
    }
});

/**
 * @swagger
 * /api/presets/{id}:
 *   delete:
 *     summary: Eliminar un preset
 *     tags: [Presets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del preset
 *     responses:
 *       200:
 *         description: Preset eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Preset no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', async (req, res) => {
    try {
        const success = await service.deleteById(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Preset no encontrado' });
        }
        res.json({ message: 'Preset eliminado exitosamente' });
    } catch (err) {
        console.error('Error eliminando preset:', err);
        res.status(500).json({ error: 'Error al eliminar preset' });
    }
});

module.exports = router;

