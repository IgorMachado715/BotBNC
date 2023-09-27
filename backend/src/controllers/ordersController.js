const ordersRepository = require('../repositories/ordersRepository');

const settingsRepository = require('../repositories/settingsRepository');

//ORDERS

async function getOrders(req, res, next) {
    const symbol = req.params.symbol && req.params.symbol.toUpperCase();

    //https://localhost:3001/orders/BTCUSDT?page=2

    const page = parseInt(req.query.page);
    const orders = await ordersRepository.getOrders(symbol, page || 1);
    res.json(orders);
}

async function placeOrder(req, res, next) {
    const id = res.locals.token.id;
    const settings = await settingsRepository.getSettingsDecrypted(id);
    const exchange = require('../utils/exchange')(settings);

    const { side, symbol, quantity, price, type, options, automationId } = req.body;

    let result;

    try {
        if (side === 'BUY')
            result = await exchange.buy(symbol, quantity, price, options);
        else if (side === 'SELL')
            result = await exchange.sell(symbol, quantity, price, options);
    }
    catch (err) {
        return res.status(400).json(err.body);
    }
    //CHAMADA NA API

    const order = await ordersRepository.insertOrder({
        automationId,
        symbol,
        quantity,
        type: options ? options.type : 'MARKET',
        side,
        limitPrice: price,
        stopPrice: options ? options.stopPrice : null,
        icebergQuantity: options ? options.icebergQty : null,
        orderId: result.orderId,
        clientOrderId: result.clientOrderId,
        transactTime: result.transactTime,
        status: result.status || 'NEW',
    });

    res.status(201).json(order.get({ plain: true }));
}

async function cancelOrder(req, res, next) {const id = res.locals.token.id;
    const settings = await settingsRepository.getSettingsDecrypted(id);
    const exchange = require('../utils/exchange')(settings);


    const {symbol, orderId} = req.params;

    try {
            result = await exchange.cancel(symbol, orderId);
    }
    catch (err) {
        return res.status(400).json(err.body);
    }

    const order = await ordersRepository.updateOrderByOrderId(result.orderId, result.origclientOrderId, {
        status: result.status
    });

    res.json(order.get({plain: true}));
}

module.exports = {
    getOrders,
    placeOrder,
    cancelOrder
}