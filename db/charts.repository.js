const { getDatabase } = require('./database');

function findAll() {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        const query = 'SELECT * FROM charts ORDER BY created_at DESC';
        
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
        const query = 'SELECT * FROM charts WHERE id = ?';
        
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
        const { name, type, config, data: chartData } = data;
        
        const query = `
            INSERT INTO charts (name, type, config, data)
            VALUES (?, ?, ?, ?)
        `;
        
        db.run(query, [
            name,
            type,
            JSON.stringify(config),
            chartData ? JSON.stringify(chartData) : null
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
        const { name, type, config, data: chartData } = data;
        
        const query = `
            UPDATE charts 
            SET name = ?, type = ?, config = ?, data = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        
        db.run(query, [
            name,
            type,
            JSON.stringify(config),
            chartData ? JSON.stringify(chartData) : null,
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
        const query = 'DELETE FROM charts WHERE id = ?';
        
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

