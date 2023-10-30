const bot = require('../bot');

function getMemory(req, res, next){
    res.json(bot.getMemory());
}

function getBrain(req, res, next){
    res.json(bot.getBrain());
}

module.exports = {
    getMemory,
    getBrain
}