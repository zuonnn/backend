'use strict';

const mongoose = require('mongoose');
const { countConnection } = require('../helpers/check.connection')
const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app-rt';

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        // Connect to MongoDB
        mongoose.connect(connectionString, {
            maxPoolSize: 50

        })
            .then(() => {
                console.log('MongoDB connected');
                countConnection();
            })
            .catch((error) => {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            });
    }

    // Singleton pattern
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
