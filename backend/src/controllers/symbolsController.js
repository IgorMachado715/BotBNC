const symbolsRepository = require('../repositories/symbolsRepository');

async function getSymbols(req, res, next) {
    const {search, page,  onlyFavorites} = req.query;

    let result;
    if (search || page || onlyFavorites)
        result = await symbolsRepository.searchSymbols(search, onlyFavorites === 'true', page);
    else
        result = await symbolsRepository.getSymbols();

    res.json(result);
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

    const favoriteSymbols = (await symbolsRepository.getSymbols()).filter(s => s.isFavorite).map(s => s.symbol);

    const settingsRepository = require('../repositories/settingsRepository');
    const settings = await settingsRepository.getSettingsDecrypted(res.locals.token.id);
    const { exchangeInfo } = require('../utils/exchange')(settings.get({ plain: true }));
    const symbols = (await exchangeInfo()).symbols.map(item => {

        const minNotionalFilter = item.filters.find(f => f.filterType === 'NOTIONAL');
        const minLotSizeFilter = item.filters.find(f => f.filterType === 'LOT_SIZE');

        return{
            symbol: item.symbol,
            basePrecision: item.baseAssetPrecision,
            quotePrecision: item.quoteAssetPrecision,
            base: item.baseAsset,
            quote: item.quoteAsset,
            minNotional: minNotionalFilter ? minNotionalFilter.minNotional : '1',
            minLotSize: minLotSizeFilter ? minLotSizeFilter.minQty : '1',
            isFavorite: favoriteSymbols.some(s => s === item.symbol)
        }
    })

    await symbolsRepository.deleteAll();
    await symbolsRepository.bulkInsert(symbols);

    res.sendStatus(201);
}

module.exports = { getSymbols, updateSymbol, getSymbol, syncSymbols }