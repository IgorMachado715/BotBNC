const WebSocket = require('ws');
const crypto = require('./utils/crypto');
const ordersRepository = require('./repositories/ordersRepository');
const { getActiveMonitors, monitorTypes } = require('./repositories/monitorsRepository');
const { RSI, MACD, indexKeys } = require('./utils/indexes');
const { or } = require('sequelize');

let WSS, bot, exchange;

function startMiniTickerMonitor(broadcastLabel, logs) {
    if (!exchange) return new Error(`Monitor de exchange não iniciado.`);

    exchange.miniTickerStream(async(markets) => {
        if (logs) console.log(markets);

        //enviar para o bot
        Object.entries(markets).map(async (mkt) => {
            delete mkt[1].volume;
            delete mkt[1].quoteVolume;
            delete mkt[1].eventTime;
            const converted = {};
            Object.entries(mkt[1]).map(prop => converted[prop[0]] = parseFloat(prop[1 ]));
            bot.updateMemory(mkt[0], indexKeys.MINI_TICKER, null, converted);
        })

        if (broadcastLabel && WSS) {
            WSS.broadcast({ [broadcastLabel]: markets });
        }
        //simulação de book
        const books = Object.entries(markets).map(mkt => {
            const book = {symbol: mkt[0], bestAsk: mkt[1].close, bestBid: mkt[1].close};
            bot.updateMemory(mkt[0], indexKeys.BOOK, null, book);
            return book;
        })
        if (WSS) WSS.broadcast({ book: books });
    })
    console.log(`Monitores de MiniTicker e Book iniciados: ${broadcastLabel}!`);
}

async function loadWallet() {
    if (!exchange) return new Error(`Monitor de exchange não iniciado.`);
    const info = await exchange.balance();
    const wallet = Object.entries(info).map(async (item) => {
        //enviar para o bot

        bot.updateMemory(item[0], indexKeys.WALLET, null, parseFloat(item[1].available));

        return {
            symbol: item[0],
            available: item[1].available,
            onOrder: item[1].onOrder
        };
    });
    return wallet;
}

function processExecutionData(executionData, broadcastLabel) {

    if (executionData.x === 'NEW') return;

    const order = {
        symbol: executionData.s,
        orderId: executionData.i,
        clientOrderId: executionData.X === 'CANCELED' ? executionData.C : executionData.c,
        side: executionData.S,
        type: executionData.o,
        status: executionData.X,
        isMaker: executionData.m,
        transactTime: executionData.T
    }

    if (order.status === 'FILLED') {
        const quoteAmount = parseFloat(executionData.Z);
        order.avgPrice = quoteAmount / parseFloat(executionData.z);
        order.comission = executionData.n;
        const isQuoteComission = executionData.N && order.symbol.endsWith(executionData.N);
        order.net = isQuoteComission ? quoteAmount - parseFloat(order.comission) : quoteAmount;
    }

    if (order.status === 'REJECTED') order.obs = executionData.r;

    setTimeout(() => {
        ordersRepository.updateOrderByOrderId(order.orderId, order.clientOrderId, order)
            .then(order => {
                //enviar para o bot
                if(order){
                    bot.updateMemory(order.symbol, indexKeys.LAST_ORDER, null, order);
                    if (broadcastLabel & WSS) {
                        WSS.broadcast({ [broadcastLabel]: order });
                    }
            }
            })
            .catch(err => console.error(err))
    }, 2000)

}

function startUserDataMonitor(broadcastLabel, logs) {
    if (!exchange) return new Error(`Monitor de exchange não iniciado.`);

    const [balanceBroadcast, executionBroadcast] = broadcastLabel.split(',');

    loadWallet();

    exchange.userDataStream(
        balanceData => {
            if (logs) console.log(balanceData);
            const wallet = loadWallet();
            if (balanceBroadcast & WSS)
                WSS.broadcast({ [balanceBroadcast]: wallet });
        },
        executionData => {
            if (logs) console.log(executionData);
            processExecutionData(executionData, executionBroadcast);
        }
    )
    console.log(`Monitor de User Data iniciado: ${broadcastLabel}!`);
}

function processChartData(symbol, indexes, interval, ohlc) {
    indexes.map(index => {
        switch(index){
            case indexKeys.RSI: {
                //RSI(ohlc.close);
                //calcular e enviar para o bot
                return bot.updateMemory(symbol, indexKeys.RSI, interval, RSI(ohlc.close));
            }
            case indexKeys.MACD: {
                //MACD(ohlc.close);
                //calcular e enviar para o bot
                return bot.updateMemory(symbol, indexKeys.MACD, interval, MACD(ohlc.close));
            }
            default: return;
        }
    })
}

function startChartMonitor(symbol, interval, indexes, broadcastLabel, logs) {

    if (!symbol) return new Error(`Não é possível iniciar o monitor Gráfico sem um símbolo!`);
    if (!exchange) return new Error(`Monitor de exchange não iniciado.`);

    exchange.chartStream(symbol, interval || "1m", (ohlc) => {

        const lastCandle = {
            open: ohlc.open[ohlc.open.length - 1],
            close: ohlc.close[ohlc.close.length - 1],
            high: ohlc.high[ohlc.high.length - 1],
            low: ohlc.low[ohlc.low.length - 1],
        }

        if (logs) console.log(lastCandle);

        //enviar para o bot
        bot.updateMemory(symbol, indexKeys.LAST_CANDLE, interval, lastCandle);

        if (broadcastLabel && WSS) WSS.broadcast(lastCandle);

        processChartData(symbol, indexes, interval, ohlc);

    })

    console.log(`Monitor Gráfico iniciou em ${symbol}_${interval}!`);
}

async function init(settings, wssInstance, botInstance) {
    if (!settings || !botInstance) throw new Error(`Não é possível iniciar sem configurações e/ou Bot.`);

    WSS = wssInstance;
    bot = botInstance;
    exchange = require('./utils/exchange')(settings);

    const monitors = await getActiveMonitors();
    monitors.map(monitor => {
        setTimeout(() => {
            switch (monitor.type) {
                case monitorTypes.MINI_TICKER:
                    return startMiniTickerMonitor(monitor.broadcastLabel, monitor.logs);
                case monitorTypes.USER_DATA:
                    return startUserDataMonitor(monitor.broadcastLabel, monitor.logs);
                case monitorTypes.CANDLES:
                    return startChartMonitor(monitor.symbol,
                                             monitor.interval, 
                                             monitor.indexes.split(','),
                                             monitor.broadcastLabel,
                                             monitor.logs);
            }
        }, 250)
    })
    console.log(`Bot consumidor de exchanges está rodando.`);
}

module.exports = {
    init,
    startChartMonitor,

}


/*
    exchange.userDataStream((balanceData) => {
        broadcast({ balance: balanceData });
    },
        executionData => processExecutionData(executionData)
    )

    function calcRSI(closes) {
        const rsiResult = technicalindicators.rsi({
            period: 14,
            values: closes
        })
        return parseFloat(rsiResult[rsiResult.length - 1]);
    }

    function processChartData(closes, callback) {
        const rsi = calcRSI(closes);
        console.log(rsi);
    }

    exchange.chartStream('BTCBUSD', "1m", (ohlc) => processChartData(ohlc.close, (msg) => {
        console.log(msg);
    }))


} */