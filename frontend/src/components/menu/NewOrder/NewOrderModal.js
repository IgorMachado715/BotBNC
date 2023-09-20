import React, { useEffect, useRef, useState } from "react";
import SelectSymbol from "./SelectSymbol";
import SymbolPrice from "./SymbolPrice";
import { getSymbol } from "../../../services/SymbolsServices";
import WalletSummary from "./WalletSummary";
import SelectSide from "./SelectSide";
import OrderType from "./OrderType";
import QuantityInput from "./QuantityInput";

function NewOrderModal(props) {

    const [error, setError] = useState('');

    const DEFAULT_ORDER = {
        symbol: "",
        limitPrice: "0",
        price: "0",
        stopPrice: "0",
        quantity: "0",
        icebergQty: "0",
        side: "BUY",
        type: "LIMIT",

    };

    const [order, setOrder] = useState(DEFAULT_ORDER);

    const btnClose = useRef('');
    const btnSend = useRef('');

    function onSubmit(event) {
        console.log('click');
    }

    function onInputChange(event) {
        setOrder(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    const [symbol, setSymbol] = useState({});

    useEffect(() => {
        if (!order.symbol) return;

        const token = localStorage.getItem('token');
        getSymbol(order.symbol, token)
            .then(symbolObject => setSymbol(symbolObject))
            .catch(err => {
                console.log(err.response ? err.response.data : err.message)
                setError(err.response ? err.response.data : err.message);
            });
    }, [order.symbol]);

    function getPriceClasses(OrderType) {
        return OrderType === 'MARKET' ? "col-md-6 mb-3 d-none" : "col-md-6 mb-3";
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
                                    <SelectSymbol onChange={onInputChange} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <SymbolPrice symbol={order.symbol} />
                                </div>
                            </div>
                            <div className="row">
                                <label>Você tem:</label>
                            </div>
                            <WalletSummary wallet={props.wallet} symbol={symbol} />
                            <div className="row">
                                <div className="col-md-6 mb-3">

                                </div>
                                <div className="col-md-6 mb-3">

                                </div>
                            </div>
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