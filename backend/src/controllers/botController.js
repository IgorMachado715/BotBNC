const bot = require('../bot');

function getMemory(req, res, next){
    res.json(bot.getMemory());
}

function getMemoryIndexes(req, res, next){
    res.json(bot.getMemoryIndexes());
}

function getBrain(req, res, next){
    res.json(bot.getBrain());
}

function getBrainIndexes(req, res, next){
    res.json(bot.getBrainIndexes());
}

module.exports = {
    getMemory,
    getBrain,
    getMemoryIndexes,
    getBrainIndexes
}