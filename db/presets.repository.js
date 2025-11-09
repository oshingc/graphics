const { getDatabase } = require('./database');

function findAll() {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        const query = 'SELECT * FROM presets ORDER BY created_at DESC';
        
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        const query = 'SELECT * FROM presets WHERE id = ?';
        
        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row || null);
            }
        });
    });
}

function insert(data) {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        const { name, description, artType, parameters } = data;
        
        const query = `
            INSERT INTO presets (name, description, art_type, parameters)
            VALUES (?, ?, ?, ?)
        `;
        
        db.run(query, [
            name,
            description || null,
            artType,
            JSON.stringify(parameters)
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

function update(id, data) {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        const { name, description, artType, parameters } = data;
        
        const query = `
            UPDATE presets 
            SET name = ?, description = ?, art_type = ?, parameters = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        
        db.run(query, [
            name,
            description || null,
            artType,
            JSON.stringify(parameters),
            id
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        });
    });
}

function deleteById(id) {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        const query = 'DELETE FROM presets WHERE id = ?';
        
        db.run(query, [id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        });
    });
}

module.exports = {
    findAll,
    findById,
    insert,
    update,
    deleteById
};

