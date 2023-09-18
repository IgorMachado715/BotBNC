import React, { useState, useEffect } from "react";
import SelectQuote, { filterSymbolNames, getDefaultQuote } from "../../../components/menu/SelectQuote/SelectQuote";
import '../Dashboard.css';
import { getSymbols } from "../../../services/SymbolsServices";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import BookRow from "./BookRow";

/**
 * props:
 * - data
 */



function BookTicker(props) {

    const history = useHistory();

    const [quote, setQuote] = useState(getDefaultQuote());

    const [symbols, setSymbols] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        getSymbols(token)
            .then(symbols => setSymbols(filterSymbolNames(symbols, quote)))
            .catch(err => {
                if (err.response && err.response.status === 401) return history.push('/');
                console.error(err);
            });
    }, [quote]);

    function onQuoteChange(event) {
        setQuote(event.target.value);
    }

    if (!props || !props.data) return (<React.Fragment></React.Fragment>);

    return (
        <React.Fragment>
            <div className="col-sm-12 col-md-6 mb-4">
                <div className="card border-0 shadow">
                    <div className="card-header">
                        <div className="row">
                            <div className="col">
                                <h2 className="fs-5 fw-bold mb-0">Book</h2>
                            </div>
                            <div className="col offset-md-3">
                                <SelectQuote onChange={onQuoteChange} />
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive divScroll">
                        <table className="table align-items-center table-flush table-sm table-hover tableFixHead">
                            <thead className="thead-light">
                                <tr>
                                    <th className="border-bottom col-2" scope="col">SÍMBOLO</th>
                                    <th className="border-bottom col-2" scope="col">BID</th>
                                    <th className="border-bottom col-2" scope="col">ASK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {symbols && symbols.length ? (
                                    symbols.map((item) => (
                                        <BookRow key={item} symbol={item} data={props.data[item]} />
                                    ))
                                ) : (
                                    <React.Fragment></React.Fragment>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default BookTicker;