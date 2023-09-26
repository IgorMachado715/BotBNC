import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const ORDERS_URL = `${API_URL}/orders/`;

const { STOP_TYPES } = require('./ExchangeService');

//valida o login efetuado
export async function getOrders(symbol, page, token) {
    const ordersUrl = `${ORDERS_URL}${symbol}?page=${page}`;
    const headers = {
        'authorization': token
    }
    const response = await axios.get(ordersUrl, { headers });
    return response.data; //{count, rows}
}

export async function cancelOrder(symbol, orderId, token) {
    const ordersUrl = `${ORDERS_URL}${symbol}/${orderId}`;
    const headers = {
        'authorization': token
    }
    const response = await axios.delete(ordersUrl, { headers });
    return response.data;
}

export async function placeOrder(order, token) {

    const postOrder = {
        symbol: order.symbol.toUpperCase(),
        quantity: order.quantity,
        side: order.side.toUpperCase(),
        type: order.type.toUpperCase(),
    };

    if (order.type !== 'MARKET') postOrder.price = order.price;
    else if (order.type === 'ICEBERG') postOrder.options = { icebergQty: order.icebergQty };
    else if (STOP_TYPES.indexOf(order.type) !== -1) postOrder.options = { stopPrice: order.stopPrice, type: order.type };

    const headers = {
        'authorization': token
    }
    const response = await axios.post(ORDERS_URL, postOrder, { headers });
    return response.data;
}