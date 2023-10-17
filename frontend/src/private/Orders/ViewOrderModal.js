import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { cancelOrder } from '../../services/OrdersService';

/**
 * props:
 * - data
 * - onCancel
 */

function ViewOrderModal(props) {

    const history = useHistory();

    const [error, setError] = useState('');
    const [order, setOrder] = useState({
        symbol: ''
    });

    useEffect(() => {
        if (props.data) {
            setOrder(props.data);

            btnCancel.current.disabled = props.data.status !== 'NEW';
        }
    }, [props.data])

    const btnClose = useRef('');
    const btnCancel = useRef('');

    function getStatusClass(status) {
        switch (status) {
            case 'PARTIALLY_FILLED': return "badge bg-info";
            case 'FILLED': return "badge bg-success";
            case 'REJECTED':
            case 'EXPIRED':
            case 'CANCELED': return "badge bg-danger";
            default: return "badge bg-primary";
        }
    }

    function getDate(timestamp) {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const frm = new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "medium",
            timeStyle: "medium",
        }).format(date);
        return frm;
    }

    function onCancelClick(event) {
        const token = localStorage.getItem('token')
        cancelOrder(order.symbol, order.orderId, token)
            .then(result => {
                btnClose.current.click();
                if (props.onCancel) props.onCancel({ target: { id: 'order', value: order.orderId } });
                return history.push('/orders/' + order.symbol);
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    btnClose.current.click();
                    return history.push('/');
                }
                console.error(err);
                setError(err.message);
            })
    }

    return (
        <div className="modal fade" id="modalViewOrder" tabIndex="-1" role="dialog" aria-labelledby="modalTitleNotify" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title">Detalhes da Ordem</p>
                        <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <b>Símbolo:</b> {order.symbol}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <span className={getStatusClass(order.status)}>{order.status}</span>
                                    {
                                        order.isMaker
                                            ? <span className="badge bg-warning" title="MAKER">M</span>
                                            : <React.Fragment></React.Fragment>
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <b>Bot ID:</b> {order.id}
                                </div>
                                {
                                    order.automationId
                                        ? (
                                            <div className="col-md-6 mb-3">
                                                <b>automation ID:</b> {order.automationId}
                                            </div>

                                        )
                                        : <React.Fragment></React.Fragment>
                                }
                            </div>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <b>IDs Binance:</b> {order.orderId} / {order.clientOrderId}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <b>Compra/Venda:</b> {order.side}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <b>Tipo:</b> {order.type}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <b>Quantidade:</b> {order.quantity}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <b>Preço Unitário:</b> {order.limitPrice}
                                </div>
                            </div>
                            <div className="row">
                                {
                                    order.icebergQuantity
                                        ? (
                                            <div className="col-md-6 mb-3">
                                                <b>Iceberg Qtd:</b> {order.icebergQuantity}
                                            </div>
                                        )
                                        : <React.Fragment></React.Fragment>
                                }
                                {
                                    order.stopPrice
                                        ? (
                                            <div className="col-md-6 mb-3">
                                                <b>Preço de parada:</b> {order.stopPrice}
                                            </div>
                                        )
                                        : <React.Fragment></React.Fragment>
                                }
                                <div className="col-md-6 mb-3">
                                    <b>Preço Médio:</b> {order.avgPrice}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <b>Data:</b> {getDate(order.transactTime)}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <b>Comissão:</b> {order.comission}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <b>Net:</b> {order.net}
                                </div>
                            </div>
                            {
                                order.obs
                                    ? (
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <b>Obs:</b> {order.obs}
                                            </div>
                                        </div>
                                    )
                                    : <React.Fragment></React.Fragment>
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        {
                            error
                                ? <div className="alert alert-danger mt-1 col-9 py-1">{error}</div>
                                : <React.Fragment></React.Fragment>
                        }
                        <button type="button" ref={btnCancel} className="btn btn-danger btn-sm" onClick={onCancelClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 27" stroke-width="1.5" stroke="currentColor" className="icon icon-xs">
                                <path fillRule="evenodd" stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg> Cancelar

                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewOrderModal;