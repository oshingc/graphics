const express = require('express');
const router = express.Router();
const service = require('../services/charts.service');

/**
 * @swagger
 * /api/charts:
 *   get:
 *     summary: Obtener todos los charts
 *     tags: [Charts]
 *     responses:
 *       200:
 *         description: Lista de charts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chart'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
    try {
        const charts = await service.getAll();
        res.json(charts);
    } catch (err) {
        console.error('Error obteniendo charts:', err);
        res.status(500).json({ error: 'Error al obtener charts' });
    }
});

/**
 * @swagger
 * /api/charts/{id}:
 *   get:
 *     summary: Obtener un chart específico
 *     tags: [Charts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del chart
 *     responses:
 *       200:
 *         description: Chart encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chart'
 *       404:
 *         description: Chart no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
    try {
        const chart = await service.getById(req.params.id);
        if (!chart) {
            return res.status(404).json({ error: 'Chart no encontrado' });
        }
        res.json(chart);
    } catch (err) {
        console.error('Error obteniendo chart:', err);
        res.status(500).json({ error: 'Error al obtener chart' });
    }
});

/**
 * @swagger
 * /api/charts:
 *   post:
 *     summary: Crear un nuevo chart
 *     tags: [Charts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChartInput'
 *     responses:
 *       200:
 *         description: Chart creado exitosamente
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
        const { name, type, config, data } = req.body;
        
        if (!name || !type || !config) {
            return res.status(400).json({ error: 'Nombre, tipo y configuración son requeridos' });
        }
        
        const id = await service.create({ name, type, config, data });
        res.json({ 
            id,
            message: 'Chart creado exitosamente'
        });
    } catch (err) {
        console.error('Error creando chart:', err);
        res.status(500).json({ error: 'Error al crear chart' });
    }
});

/**
 * @swagger
 * /api/charts/{id}:
 *   put:
 *     summary: Actualizar un chart
 *     tags: [Charts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del chart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChartInput'
 *     responses:
 *       200:
 *         description: Chart actualizado exitosamente
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
 *         description: Chart no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', async (req, res) => {
    try {
        const { name, type, config, data } = req.body;
        
        if (!name || !type || !config) {
            return res.status(400).json({ error: 'Nombre, tipo y configuración son requeridos' });
        }
        
        const success = await service.update(req.params.id, { name, type, config, data });
        if (!success) {
            return res.status(404).json({ error: 'Chart no encontrado' });
        }
        
        res.json({ 
            id: req.params.id,
            message: 'Chart actualizado exitosamente'
        });
    } catch (err) {
        console.error('Error actualizando chart:', err);
        res.status(500).json({ error: 'Error al actualizar chart' });
    }
});

/**
 * @swagger
 * /api/charts/{id}:
 *   delete:
 *     summary: Eliminar un chart
 *     tags: [Charts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del chart
 *     responses:
 *       200:
 *         description: Chart eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Chart no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', async (req, res) => {
    try {
        const success = await service.deleteById(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Chart no encontrado' });
        }
        res.json({ message: 'Chart eliminado exitosamente' });
    } catch (err) {
        console.error('Error eliminando chart:', err);
        res.status(500).json({ error: 'Error al eliminar chart' });
    }
});

module.exports = router;

