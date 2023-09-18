const settingsRepository = require('../repositories/settingsRepository');

async function getBalance(req, res, next) {
    const id = res.locals.token.id;
    const settings = await settingsRepository.getSettingsDecrypted(id);

    const exchange = require('../utils/exchange')(settings);
    const balance = await exchange.balance();
    res.json(balance);
}



module.exports = { getBalance }