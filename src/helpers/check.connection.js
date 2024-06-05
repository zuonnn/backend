'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')

// Time in milliseconds
const _SECONDS = 5000

// Check the number of connections
const countConnection = () => {
    const numberConnections = mongoose.connections.length
    console.log(`Number of connections: ${numberConnections}`)
}

// Check the memory overload
const checkOverload = () => {
    setInterval(() => {
        // Memory usage
        const totalMemory = os.totalmem()
        const freeMemory = os.freemem()
        const usedMemory = totalMemory - freeMemory
        const percentageMemory = (usedMemory / totalMemory) * 100

        // Number of connections
        const numberConnections = mongoose.connections.length
        const numberCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024
        const maxConnections = numberCores * 5

        // Print the results
        console.log();
        console.log(`Memory usage: ${Math.floor(memoryUsage)} MB`)
        console.log(`Percentage memory: ${Math.floor(percentageMemory)}`);
        console.log(`Number of connections: ${numberConnections}`)
        
        // Check if the memory usage is greater than 90% or the number of connections is greater than the maximum
        if (percentageMemory > 90 || numberConnections > maxConnections) {
            console.log('Memory overload')
        }

    }, _SECONDS)
}

module.exports = {
    countConnection,
    checkOverload
}