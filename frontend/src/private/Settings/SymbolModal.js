import React, { useState, useEffect, useRef } from "react";
import { updateSymbol } from "../../services/SymbolsServices";

/**
 * props:
 * - data
 * - onSubmit
 */

function SymbolModal(props) {


    const symbolInput = useRef('');
    const basePrecisionInput = useRef('');
    const quotePrecisionInput = useRef('');
    const minNotionalInput = useRef('');
    const minLotSizeInput = useRef('');

    const btnClose = useRef('');
    const [error, setError] = useState('');
    const [symbol, setSymbol] = useState({});

    useEffect(() => {
        if (!props.data) return;
        setSymbol(props.data);
    }, [props.data])

    function onInputChange(event) {
        setSymbol(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    function getStarFillColor() {
        return symbol.isFavorite ? "Yellow" : "White";
    }

    function onFavoriteClick(event) {
        symbol.isFavorite = !symbol.isFavorite;
        const token = localStorage.getItem("token");
        updateSymbol(symbol, token)
            .then((result) => {
                setError("");
                setSymbol({ ...symbol });
            })
            .catch((err) => setError(err.response ? err.response.data : err.message));
    }

    function onSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');
        updateSymbol({
            symbol: symbolInput.current.value,
            basePrecision: basePrecisionInput.current.value,
            quotePrecision: quotePrecisionInput.current.value,
            minNotional: minNotionalInput.current.value,
            minLotSize: minLotSizeInput.current.value
            }, token)
            .then(result =>{
                setError('');
                props.onSubmit();
                btnClose.current.click();
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            });
    }

    return (
        <div className="modal fade" id="modalSymbol" tabIndex="-1" role="dialog" aria-labelledby="modalTitleNotify" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title" id="modalTitleNotify">Editar Símbolo</p>
                        <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="py-3">
                                <div className="form-group mb-4">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group mb-4">
                                                <label htmlFor="symbol">Símbolo</label>
                                                <div className="input-group">
                                                    <input ref={symbolInput} className="form-control" id="symbol" type="text" placeholder="BTCUSD" defaultValue={symbol.symbol} required disabled />
                                                    <button type="button" className="btn btn-secondary d-inline-flex align-items-center me-2" onClick={onFavoriteClick}>
                                                        <svg className="icon icon-xs" xmlns="http://www.w3.org/2000/svg" fill={getStarFillColor()} viewBox="0 0 26 26" stroke-width="1.5" stroke="orange" onClick={onFavoriteClick}>
                                                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="basePrecision">Precisão de Base:</label>
                                                <input ref={basePrecisionInput} type="number" className="form-control" id="basePrecision" placeholder="8" defaultValue={symbol.basePrecision} required onChange={onInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="quotePrecision">Precisão de Cotação:</label>
                                                <input ref={quotePrecisionInput} type="number" className="form-control" id="quotePrecision" placeholder="8" defaultValue={symbol.quotePrecision} required onChange={onInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="minNotional">Mínimo Nocional:</label>
                                                <input ref={minLotSizeInput} type="text" className="form-control" id="minNotional" placeholder="0.1" defaultValue={symbol.minNotional} required onChange={onInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="minLotSize">Tamanho Mínimo do Lote:</label>
                                                <input ref={minLotSizeInput} type="text" className="form-control" id="minLotSize" placeholder="0.1" defaultValue={symbol.minLotSize} required onChange={onInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="modal-footer">
                        {
                            error 
                                ? ( <div className="alert alert-danger">{error}</div>)
                                : (<React.Fragment></React.Fragment>
                        )}
                        <button type="submit" className="btn btn-sm btn-primary">
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SymbolModal;