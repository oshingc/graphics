const repo = require('../db/presets.repository');

async function getAll() {
    const rows = await repo.findAll();
    return rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        artType: row.art_type,
        parameters: JSON.parse(row.parameters),
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }));
}

async function getById(id) {
    const row = await repo.findById(id);
    if (!row) return null;

    return {
        id: row.id,
        name: row.name,
        description: row.description,
        artType: row.art_type,
        parameters: JSON.parse(row.parameters),
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

async function create(data) {
    const id = await repo.insert(data);
    return id;
}

async function update(id, data) {
    const success = await repo.update(id, data);
    return success;
}

async function deleteById(id) {
    const success = await repo.deleteById(id);
    return success;
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById
};

