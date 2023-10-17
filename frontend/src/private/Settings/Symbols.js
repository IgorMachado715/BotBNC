import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { searchSymbols, syncSymbols } from "../../services/SymbolsServices";
import SymbolRow from "./SymbolRow";
import SelectQuote, { getDefaultQuote, setDefaultQuote } from "../../components/menu/SelectQuote/SelectQuote";
import SymbolModal from "./SymbolModal";
import Pagination from "../../components/Pagination/Pagination";

function Symbols() {

    const history = useHistory();

    const defaultLocation = useLocation();

    function getPage(location){
        if(!location) location = defaultLocation;
        return new URLSearchParams(location.search).get('page') || 1;
    }

    useEffect(() => {
        return history.listen(location => {
            setPage(getPage(location));
        })
    }, [history])

    const [symbols, setSymbols] = useState([]);

    const [error, setError] = useState('');

    const [page, setPage] = useState(getPage());

    const [count, setCount] = useState(0);

    const [editSymbol, setEditSymbol] = useState({
        symbol: '',
        basePrecision: 0,
        quotePrecision: 0,
        minLotSize: '',
        minNotional: ''
    })

    const [quote, setQuote] = useState(getDefaultQuote());

    const [success, setSuccess] = useState('');

    const [isSyincing, setIsSyincing] = useState(false);

    function onEditSymbol(event) {
        const symbolObj = event.target.id.replace("edit", "");
        const symbol = symbols.find((s) => s.symbol === symbolObj);
        setEditSymbol(symbol);
    }

    function onSyncClick(event) {
        const token = localStorage.getItem('token');
        setIsSyincing(true);
        syncSymbols(token)
            .then(response => setIsSyincing(false))
            .catch(err => {
                if (err.response && err.response.status === 401) return history.push('/');
                console.error(err.message);
                setError(err.message);
                setSuccess('');
            })
    }

    function errorHandling(err) {
        console.error(err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data : err.message);
        setSuccess('');
    }

    function onQuoteChange(event) {
        setQuote(event.target.value);
        setDefaultQuote(event.target.value);
    }

    function loadSymbols(selectedValue) {
        const token = localStorage.getItem('token');
        const search = selectedValue === 'FAVORITES' ? '' : selectedValue;
        const onlyFavorites = selectedValue === 'FAVORITES';
        searchSymbols(search, onlyFavorites, getPage(), token)
            .then(result => {
                setSymbols(result.rows);
                setCount(result.count);
            })
            .catch(err => errorHandling(err))
    }

    useEffect(() => {
        loadSymbols(quote);
    }, [isSyincing, quote, page])

    function onModalSubmit(event) {
        loadSymbols();
    }

    return (<React.Fragment>
        <div className="row">
            <div className="col-12">
                <div className="col-12 mb-4">
                    <div className="card border-0 shadow">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h2 className="fs-5 fw-bold mb-0">Símbolos</h2>
                                </div>
                                <div className="col">
                                    <SelectQuote onChange={onQuoteChange} />
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table align-items-center table-flush">
                                <thead className="thead-light">
                                    <tr>
                                        <th className="border-bottom" scope="col">Símbolo</th>
                                        <th className="border-bottom" scope="col">Precisão Base</th>
                                        <th className="border-bottom" scope="col">Precisão Cotação</th>
                                        <th className="border-bottom" scope="col">Mínimo Nocional</th>
                                        <th className="border-bottom" scope="col">Quantidade Mínima</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {symbols.map((item) => <SymbolRow key={item.symbol} data={item} onClick={onEditSymbol} />)}
                                </tbody>
                            </table>
                            <Pagination count={count} />
                            <div className="card-footer">
                                <div className="row">
                                    <div className="col">
                                        <button className="btn btn-primary animate-up-2" type="button" onClick={onSyncClick}>
                                            <svg className="icon icon-xs" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor">
                                                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                            </svg>
                                            {isSyincing ? "Sincronizando..." : "Sincronizar"}
                                        </button>
                                    </div>
                                    <div className="col">
                                        {error
                                            ? <div className="alert alert-danger">{error}</div>
                                            : <React.Fragment></React.Fragment>
                                        }
                                        {success
                                            ? <div className="alert alert-success">{success}</div>
                                            : <React.Fragment></React.Fragment>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <SymbolModal data={editSymbol} onSubmit={onModalSubmit} />
    </React.Fragment>);
}

export default Symbols;