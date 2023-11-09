import React, { useRef, useState, useEffect } from "react";
import SmartBadge from "../../../components/SmartBadge/SmartBadge";


/**
 * props:
 * - indexes
 * - onChange
 */
function MonitorIndex(props) {

    const btnAddIndex = useRef('');
    const selectIndex = useRef('');
    const inputPeriod = useRef('');

    const [indexes, setIndexes] = useState([]);

    useEffect(() => {
        if (props.indexes) {
            setIndexes(props.indexes ? props.indexes.split(",") : []);
          } else setIndexes([]);
        }, [props.indexes]);

    function onAddIndexClick(event) {
        const value = selectIndex.current.value;
        if (value !== 'NONE' && indexes.indexOf(value) === -1) {
            inputPeriod.current.value = inputPeriod.current.value === 'Parâmetros' ? '' : inputPeriod.current.value;
            indexes.push(value + '_' + inputPeriod.current.value.split(',').join('_'));
            //RSI,MACD => RSI_14, MACD_10

            selectIndex.current.value = 'NONE';
            inputPeriod.current.value = '';

            setIndexes(indexes);
            if (props.onChange)
                props.onChange({ target: { id: "indexes", value: indexes.join(",") } });
        }
    }

    function onRemoveIndex(event) {
        const id = event.target.id.replace('ix', '');
        const pos = indexes.findIndex(ix => ix === id);
        indexes.splice(pos, 1);
        setIndexes(indexes);
        if (props.onChange) 
            props.onChange({ target: { id: "indexes", value: indexes.join(",") } });
    }

    function onIndexChange(event){
        switch(event.target.value){
            case 'BB': inputPeriod.current.placeholder = 'period, std. dev.'; break;
            case 'EMA': inputPeriod.current.placeholder = 'period'; break;
            case 'MACD': inputPeriod.current.placeholder = 'fast, slow and signal periods'; break;
            case 'RSI': inputPeriod.current.placeholder = 'period'; break;
            case 'SMA': inputPeriod.current.placeholder = 'period'; break;
            case 'SRSI': inputPeriod.current.placeholder = 'd, k, rsi and stochastic periods'; break;
            default: break;
        }
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="form-group">
                        <label htmlFor="indexes">Indexes: <span data-bs-toggle="tooltip" data-bs-placement="top" title="Os Parâmetros em parênteses devem ser fornecidos." className="badge bg-warning py-1">?</span> </label>
                        <div className="input-group input-group-merge">
                            <select id="indexes" ref={selectIndex} className="form-select" defaultValue="NONE" onChange={onIndexChange}>
                                <option value="NONE">None</option>
                                <option value="BB">Bollinger Bands (period and std. dev.)</option>
                                <option value="EMA">EMA (period)</option>
                                <option value="MACD">MACD (fast, slow and signal periods)</option>
                                <option value="RSI">RSI (period)</option>
                                <option value="SMA">SMA (period)</option>
                                <option value="SRSI">Stoch RSI (d, k, rsi and stochastic periods)</option>
                            </select>
                            <input ref={inputPeriod} type="text" id="params" placeholder="Parâmetros" className="form-control" required={true} />
                            <button type="button" className="btn btn-secondary" ref={btnAddIndex} onClick={onAddIndexClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon icon-xs">
                                    <path fillRule="evenodd" stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-inline-flex align-content-start">
                {
                    indexes.map((ix) => (
                        <SmartBadge key={ix} id={"ix" + ix} text={ix} onClick={onRemoveIndex} />
                    ))
                }
            </div>
        </React.Fragment>
    )
}

export default MonitorIndex;