const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'artworks.db');

let db = null;

function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
}

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error abriendo base de datos:', err.message);
                reject(err);
            } else {
                console.log('Conectado a la base de datos SQLite.');
                createTables()
                    .then(() => resolve(db))
                    .catch(reject);
            }
        });
    });
}

function createTables() {
    return new Promise((resolve, reject) => {
        const tables = [
            {
                name: 'artworks',
                sql: `
                    CREATE TABLE IF NOT EXISTS artworks (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        type TEXT NOT NULL,
                        parameters TEXT NOT NULL,
                        image_data TEXT,
                        canvas_size TEXT,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `
            },
            {
                name: 'charts',
                sql: `
                    CREATE TABLE IF NOT EXISTS charts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        type TEXT NOT NULL,
                        config TEXT NOT NULL,
                        data TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `
            },
            {
                name: 'presets',
                sql: `
                    CREATE TABLE IF NOT EXISTS presets (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        description TEXT,
                        art_type TEXT NOT NULL,
                        parameters TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `
            }
        ];

        let completed = 0;
        let hasError = false;

        tables.forEach(({ name, sql }) => {
            db.run(sql, (err) => {
                if (err) {
                    if (!hasError) {
                        hasError = true;
                        console.error(`Error creando tabla ${name}:`, err.message);
                        reject(err);
                    }
                } else {
                    console.log(`Tabla ${name} inicializada.`);
                    completed++;
                    if (completed === tables.length && !hasError) {
                        resolve();
                    }
                }
            });
        });
    });
}

function closeDatabase() {
    return new Promise((resolve, reject) => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error('Error cerrando base de datos:', err.message);
                    reject(err);
                } else {
                    console.log('Base de datos cerrada.');
                    db = null;
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
}

module.exports = {
    getDatabase,
    initializeDatabase,
    closeDatabase
};

