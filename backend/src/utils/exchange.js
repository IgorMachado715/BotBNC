const Binance = require('node-binance-api');
const { or } = require('sequelize');
const LOGS = process.env.BINANCE_LOGS === "true";

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

    function buy(symbol, quantity, price, options){
        if(price)
            return binance.buy(symbol, quantity, price, options);

        return binance.marketBuy(symbol, quantity);
    }

    function sell(symbol, quantity, price, options){
        if(price)
            return binance.sell(symbol, quantity, price, options);

        return binance.marketSell(symbol, quantity);
    }

    function cancel(symbol, orderId){
        return binance.cancel(symbol, orderId);
    }

    function orderStatus(symbol, orderId){
        return binance.orderStatus(symbol, orderId);
    }

    async function orderTrade(symbol, orderId){
        const trades = await binance.trades(symbol);
        return trades.find((t) => t.orderId === orderId);
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
            subscribedData => console.log(`userDataStream:subscribed: ${subscribedData}`),
            listStatusData => listStatusCallback(listStatusData)
        );
    }

    async function chartStream(symbol, interval, callback){
        const binance = new Binance().options({ family: 0 });
        const streamUrl = binance.websockets.chart(symbol, interval, (symbol, interval, chart) => {
            const tick = binance.last(chart);
            if(tick && chart[tick] && chart[tick].isFinal === false)
                return;
            //console.log(chart);
            const ohlc = binance.ohlc(chart);
            //console.log(ohlc);
            callback(ohlc);
        });
        if(LOGS) console.log(`Chart Stream conectado em ${streamUrl}`);
    }

    function terminateChartStream(symbol, interval){
        //btcusdt@kline_1m
        binance.websockets.terminate(`${symbol.toLowerCase()}@kline_${interval}`);
        console.log(`Chart Stream ${symbol.toLowerCase()}@kline_${interval} finalizado!`)
    }

    return {
        exchangeInfo,
        miniTickerStream,
        bookStream,
        userDataStream,
        chartStream,
        balance,
        buy,
        sell,
        cancel,
        orderStatus,
        orderTrade,
        terminateChartStream
    }
}