const WebSocket = require('ws');
const crypto = require('./utils/crypto');
const ordersRepository = require('./repositories/ordersRepository');
const technicalindicators = require('technicalindicators');

module.exports = (settings, wss) => {

    if (!settings) throw new Error(`Não é possível iniciar o bot sem configurações.`);

    const exchange = require('./utils/exchange')(settings);

    function broadcast(jsonObject) {
        if (!wss || !wss.clients) return;
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ jsonObject }));
            }
        });
    }

    exchange.miniTickerStream((markets) => {
        //console.log(markets);
        broadcast({ miniTicker: markets });

        const books = Object.entries(markets).map(mkt => {
            return { symbol: mkt[0], bestAsk: mkt[1].close, bestBid: mkt[1].close };
        });
        broadcast({ book: books });
    })

    function processExecutionData(executionData){

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

        if(order.status === 'FILLED'){
            const quoteAmount = parseFloat(executionData.Z);
            order.avgPrice = quoteAmount / parseFloat(executionData.z);
            order.comission = executionData.n;
            const isQuoteComission = executionData.N && order.symbol.endsWith(executionData.N);
            order.net = isQuoteComission ? quoteAmount - parseFloat(order.comission) : quoteAmount;
        }

        if(order.status === 'REJECTED') order.obs = executionData.r;

        setTimeout(() => {
            ordersRepository.updateOrderByOrderId(order.orderId, order.clientOrderId, order)
                .then(order => order && broadcast({execution: order}))
                .catch(err => console.error(err))
        }, 10000)

    }

    exchange.userDataStream((balanceData) => {
        broadcast({ balance: balanceData });
    },
        executionData => processExecutionData(executionData) 
    )

    function calcRSI(closes){
        const rsiResult = technicalindicators.rsi({
            period: 14,
            values: closes
        })
        return parseFloat(rsiResult[rsiResult.length - 1]);
    }

    function processChartData(closes, callback){
        const rsi = calcRSI(closes);
        console.log(rsi);
    }

    exchange.chartStream('BTCBUSD', "1m", (ohlc) => processChartData(ohlc.close, (msg) => {
        console.log(msg);
    }))

    console.log(`Bot consumidor de exchanges está rodando.`);
}