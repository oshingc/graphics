const repo = require('../db/artworks.repository');

module.exports = {
    async getAll() {
        const rows = await repo.findAll();
        return rows.map(r => ({
            id: r.id,
            type: r.type,
            parameters: JSON.parse(r.parameters),
            imageData: r.image_data,
            canvasSize: JSON.parse(r.canvas_size || '{}'),
            timestamp: r.timestamp
        }));
    },

    async getById(id) {
        const row = await repo.findById(id);
        if (!row) return null;

        return {
            id: row.id,
            type: row.type,
            parameters: JSON.parse(row.parameters),
            imageData: row.image_data,
            canvasSize: JSON.parse(row.canvas_size || '{}'),
            timestamp: row.timestamp
        };
    },

    async create(data) {
        const id = await repo.insert(data);
        return id;
    },

    async delete(id) {
        return await repo.delete(id);
    }
};
