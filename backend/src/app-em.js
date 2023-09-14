const crypto = require('./utils/crypto');

module.exports = (settings) => {

    if (!settings) throw new Error(`Não é possível iniciar o bot sem configurações.`);

    settings.secretKey = crypto.decrypt(settings.secretKey);
    const exchange = require('./utils/exchange')(settings);

    exchange.miniTickerStream((markets) => {
        //console.log(markets);
    })
}