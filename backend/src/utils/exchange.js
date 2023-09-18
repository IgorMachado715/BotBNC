const Binance = require('node-binance-api');

module.exports = (settings) => {
    if (!settings) throw new Error('The settings object is required to connect on exchange.');

    const binance = new Binance({
        APIKEY: settings.accessKey,
        APISECRET: settings.secretKey,
        family: 0,
        urls: {
            base: settings.apiUrl.endsWith('/') ? settings.apiUrl : settings.apiUrl + '/',
            stream: settings.streamUrl.endsWith('/') ? settings.streamUrl : settings.streamUrl + '/',
        }
    });

    async function balance() {
        await binance.useServerTime();
        return binance.balance();
    }

    function exchangeInfo() {
        return binance.exchangeInfo();
    }

    function miniTickerStream(callback) {
        binance.websockets.miniTicker(markets => callback(markets));
    }

    function bookStream(callback) {
        binance.websockets.bookTickers(order => callback(order));
    }

    function userDataStream(balanceCallback, executionCallback, listStatusCallback) {
        binance.websockets.userData(
            balance => balanceCallback(balance),
            executionData => executionCallback(executionData),
            subscribedData => console.log(`userDataStream:subscribed ${subscribedData}`),
            listStatusData => listStatusCallback(listStatusData)
        );
    }

    return {
        exchangeInfo,
        miniTickerStream,
        bookStream,
        userDataStream,
        balance
    }
}