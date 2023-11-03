import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import SelectSymbol from "../../SelectSymbol/SelectSymbol";
import SymbolPrice from "./SymbolPrice";
import { getSymbol } from "../../../services/SymbolsServices";
import WalletSummary from "./WalletSummary";
import SelectSide from "./SelectSide";
import OrderType from "./OrderType";
import QuantityInput from "./QuantityInput";
import { STOP_TYPES } from "../../../services/ExchangeService";
import {placeOrder} from "../../../services/OrdersService";

/**
 * props:
 * - wallet
 * - onSubmit
 */

function NewOrderModal(props) {
    const btnClose = useRef('');
    const btnSend = useRef('');
    const inputTotal = useRef('');
    const history = useHistory();
    const [error, setError] = useState('');
    

    const DEFAULT_ORDER = {
        symbol: "",
        price: "0",
        stopPrice: "0",
        limitPrice: "0",
        price: "0",
        stopPrice: "0",
        quantity: "0",
        icebergQty: "0",
        side: "BUY",
        type: "LIMIT",
        minNotional: "",
        minLotSize: "",
        baseAsset: "",
        quoteAsset: ""

    };

    const [symbol, setSymbol] = useState({});
    const [order, setOrder] = useState(DEFAULT_ORDER);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {

        const modal = document.getElementById('modalOrder');
        modal.addEventListener('hidden.bs.modal', (event) => {
            setIsVisible(false);
        });
        modal.addEventListener('shown.bs.modal', (event) => {
            setIsVisible(true);
        });
    }, [props.wallet]);

    

    function onSubmit(event) {
        const token = localStorage.getItem('token');
        placeOrder(order, token)
            .then(result => {
                btnClose.current.click();
                if(props.onSubmit) props.onSubmit(result);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            })
    }

    function onInputChange(event) {
        setOrder((prevState) => ({ ...prevState, [event.target.id]: event.target.value }));
    }


    useEffect(() => {
        if (!order.symbol) return;
        const token = localStorage.getItem('token');
        getSymbol(order.symbol, token)
            .then((symbolObject) => setSymbol(symbolObject))
            //.then(symbolObject => {
                //order.minNotional = symbolObject.minNotional;
               // order.minLotSize = symbolObject.minLotSize;
               // setOrder(order);
           // })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                return setError(err.response ? err.response.data : err.message);
            })
    }, [order.symbol]);

    useEffect(() => {
        setError('');
        btnSend.current.disabled = false;

        const quantity = parseFloat(order.quantity);

        if (quantity && quantity < parseFloat(symbol.minLotSize)) {
            btnSend.current.disabled = true;
            return setError(`Min Lot Size ${symbol.minLotSize}`);
        }

        if (order.type === 'ICEBERG') {
            const icebergQty = parseFloat(order.icebergQty);

            if (icebergQty && icebergQty < parseFloat(symbol.minLotSize)) {
                btnSend.current.disabled = true;
                return setError(`Min Lot Size (I) ${symbol.minLotSize}`);
            }
        }

        if (!quantity) return;

        const price = parseFloat(order.price);
        if (!price) return;

        const total = price * quantity;
        inputTotal.current.value = `${total}`.substring(0, 8);

        const minNotional = parseFloat(symbol.minNotional);
        if (total < minNotional) {
            btnSend.current.disabled = true;
            return setError('Min Notional: ' + symbol.minNotional);
        }
    }, [order.quantity, order.price, order.icebergQty]);

    const walletRow = useMemo(() => (
        <WalletSummary wallet={props.wallet} order={order} onOrderUpdate={setOrder} />
    ), [props.wallet, order.symbol]);
    

    function getPriceClasses(OrderType) {
        return ["MARKET", "STOP_LOSS", "TAKE_PROFIT"].includes(
            OrderType
        )
            ? "col-md-6 mb-3 d-none"
            : "col-md-6 mb-3";
    }

    function getIcebergClasses(OrderType) {
        return OrderType === 'ICEBERG' ? "col-md-6 mb-3" : "col-md-6 mb-3 d-none";
    }

    function getStopPriceClasses(OrderType) {
        return STOP_TYPES.indexOf(OrderType) !== -1 ? "col-md-6 mb-3" : "col-md-6 mb-3 d-none";
    }

    function onPriceChange(book) {

        if (!["MARKET", "STOP_LOSS", "TAKE_PROFIT"].includes(order.type) || !btnSend.current)
            return;

        btnSend.current.disabled = false;
        setError('');

        const quantity = parseFloat(order.quantity);
        if (quantity) {
            if (order.side === 'BUY')
                inputTotal.current.value = `${quantity * parseFloat(book.ask)}`.substring(0, 8);
            else
                inputTotal.current.value = `${quantity * parseFloat(book.bid)}`.substring(0, 8);

            if (parseFloat(inputTotal.current.value) < symbol.minNotional) {
                btnSend.current.disabled = true;
                return setError('Min Notional: ' + symbol.minNotional);
            }
        }

        setOrder((prevState) => ({
            ...prevState,
            price: parseFloat(book.bid),
        }));
    }



    return (
        <div className="modal fade" id="modalOrder" tabIndex="-1" role="dialog" aria-labelledby="modalTitleNotify" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title" id="modalTitleNotify">Nova Ordem</p>
                        <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close">

                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="symbol">Símbolo:</label>
                                        <SelectSymbol onChange={onInputChange} />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    {
                                        isVisible
                                            ? <SymbolPrice symbol={order.symbol} onChange={onPriceChange} />
                                            : <React.Fragment></React.Fragment>

                                    }
                                </div>
                            </div>
                            <div className="row">
                                <label>Você tem:</label>
                            </div>
                            <WalletSummary wallet={props.wallet} symbol={symbol} />
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <SelectSide side={order.side} onChange={onInputChange} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <OrderType type={order.type} onChange={onInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className={getPriceClasses(order.type)}>
                                    <div className="form-group">
                                        <label htmlFor="price">Preço Unitário:</label>
                                        <input type="number" className="form-control" id="price" placeholder={order.price} onChange={onInputChange} />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <QuantityInput id="quantity" text="Quantity:" symbol={symbol} wallet={props.wallet} price={order.price} side={order.side} onChange={onInputChange} />
                                </div>
                                <div className={getStopPriceClasses(order.type)}>
                                    <div className="form-group">
                                        <label htmlFor="stopPrice">Preço de Parada:</label>
                                        <input className="form-control" id="stopPrice" type="number" onChange={onInputChange} placeholder={order.stopPrice} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className={getIcebergClasses(order.type)}>
                                    <QuantityInput id="icebergQty" text="IcebergQty:" symbol={symbol} wallet={props.wallet} price={order.price} side={order.side} onChange={onInputChange} />
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="form-group">
                                    <label htmlFor="total">Preço Total:</label>
                                    <input ref={inputTotal} className="form-control" id="total" type="number" placeholder="0" disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {
                            error
                                ? <div className="alert alert-danger mt-1 col-9 py-1">{error}</div>
                                : <React.Fragment></React.Fragment>
                        }
                        <button ref={btnSend} type="button" className="btn btn-sm btn-primary" onClick={onSubmit}>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewOrderModal;