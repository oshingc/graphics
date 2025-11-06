const express = require('express');
const router = express.Router();
const service = require('../services/artworks.service');

// GET /api/art
router.get('/', async (req, res) => {
    try {
        res.json(await service.getAll());
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener artefactos' });
    }
});

// GET /api/art/:id
router.get('/:id', async (req, res) => {
    const art = await service.getById(req.params.id);
    if (!art) return res.status(404).json({ error: 'No encontrado' });
    res.json(art);
});

// POST /api/art
router.post('/', async (req, res) => {
    try {
        const id = await service.create(req.body);
        res.json({ id, message: 'Guardado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al guardar' });
    }
});

// DELETE /api/art/:id
router.delete('/:id', async (req, res) => {
    const deleted = await service.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Eliminado' });
});

module.exports = router;
