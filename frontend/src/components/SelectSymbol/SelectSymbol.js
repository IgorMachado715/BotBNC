import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSymbols } from "../../services/SymbolsServices";
import SelectQuote, {getDefaultQuote} from "../menu/SelectQuote/SelectQuote";

/**
 * props:
 * - symbol
 * - onlyFavorites
 * - disabled
 * - onChange
 */

function SelectSymbol(props) {

    const [quote, setQuote] = useState(false);

    const [symbols, setSymbols] = useState(["CARREGANDO"]);
    const [onlyFavorites, setOnlyFavorites] = useState(showOnlyFavorites());

    const selectRef = useRef('');
    const buttonRef = useRef('');

    function showOnlyFavorites(){
        return props.onlyFavorites !== null || props.onlyFavorites !== undefined ? props.onlyFavorites :  true; 
    }

    useEffect(() => {
        selectRef.current.value = props.symbol || 'BTCUSDT';
        buttonRef.current.value = buttonRef.current.disabled = props.disabled;
    }, [props.symbol]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        getSymbols(token)
            .then(symbolObjects => {
                const symbolNames = onlyFavorites
                    ? symbolObjects.filter(s => s.isFavorite).map(s => s.symbol)
                    : symbolObjects.map(s => s.symbol)

                if (symbolNames.length) {
                    setSymbols(symbolNames);
                    selectRef.current.value = symbolNames[0];
                    props.onChange({ target: { id: 'symbol', value: symbolNames[0] } });
                }
                else setSymbols(["SEM SIMBOLOS"]);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setSymbols(["ERROR"]);
            })

    }, [onlyFavorites]);

    useEffect(() => {
        selectRef.current.value = props.symbol;
    }, [props.symbol]);

    function onFavoriteClick(event) {
        setOnlyFavorites(!onlyFavorites);
    }

    function getStarFillColor(){
        return onlyFavorites ? "yellow" : "white";
    }

    const selectSymbol = useMemo(() => {
        return (
                <div className="input-group">
                    <button ref={buttonRef} type="button" className="btn btn-secondary d-inline-flex align-items-center" onClick={onFavoriteClick}>
                        <svg className="icon icon-xs" xmlns="http://www.w3.org/2000/svg" fill={getStarFillColor()} viewBox="0 0 26 26" stroke-width="1.5" stroke="orange" onClick={onFavoriteClick}>
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                    </button>
                    <select ref={selectRef} id="symbol" className="form-select" onChange={props.onChange}>
                        {symbols.map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                </div>
        )
    }, [symbols]);
    return (
        selectSymbol
    )
}

export default SelectSymbol;