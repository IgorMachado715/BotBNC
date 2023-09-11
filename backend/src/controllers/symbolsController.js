const symbolsRepository = require('../repositories/symbolsRepository');

async function getSymbols(req, res, next) {
    const symbols = await symbolsRepository.getSymbols();
    res.json(symbols);
}

async function updateSymbol(req, res, next) {
    const newSymbol = req.body;
    const symbol = req.params.symbol;
    await symbolsRepository.updateSymbol(symbol, newSymbol);
    res.sendStatus(200);
}

async function getSymbol(req, res, next) {
    const symbol = req.params.symbol; 
    const symbolData = await symbolsRepository.getSymbol(symbol);
    res.json(symbolData);
}

async function syncSymbols(req, res, next) {

    res.sendStatus(200);
}

module.exports = { getSymbols, updateSymbol, getSymbol, syncSymbols }