const WebSocket = require('ws');
const crypto = require('./utils/crypto');

module.exports = (settings, wss) => {

    if (!settings) throw new Error(`Não é possível iniciar o bot sem configurações.`);

    settings.secretKey = crypto.decrypt(settings.secretKey);
    const exchange = require('./utils/exchange')(settings);

    exchange.miniTickerStream((markets) => {
        //console.log(markets);
        if (!wss || !wss.clients) return;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ miniTicker: markets }));
            }
        });

        const books = Object.entries(markets).map(mkt => {
            return { symbol: mkt[0], bestAsk: mkt[1].close, bestBid: mkt[1].close }
        })
    
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ book: books }));
            }
        });
    })

    

    console.log(`Bot consumidor de exchanges está rodando.`);
}