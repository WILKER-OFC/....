const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../data.json');

// Simple queue mechanism to prevent concurrent writes
let writeQueue = Promise.resolve();

const readData = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            const initialData = { users: [] };
            await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        throw error;
    }
};

const writeData = (data) => {
    writeQueue = writeQueue.then(async () => {
        try {
            await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error writing to DB:', error);
        }
    });
    return writeQueue;
};

module.exports = { readData, writeData };
