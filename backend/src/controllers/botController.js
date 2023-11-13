const bot = require('../bot');
const indexes = require('../utils/indexes');

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

function getAnalysisIndexes(req, res, next) {
    res.json(indexes.getAnalysisIndexes());
  }

module.exports = {
    getMemory,
    getBrain,
    getMemoryIndexes,
    getBrainIndexes,
    getAnalysisIndexes
}