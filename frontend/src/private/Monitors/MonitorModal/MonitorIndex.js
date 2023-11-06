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

    const [indexes, setIndexes] = useState([]);

    useEffect(() => {
        if (props.indexes) {
            setIndexes(props.indexes ? props.indexes.split(",") : []);
          } else setIndexes([]);
        }, [props.indexes]);

    function onAddIndexClick(event) {
        const value = selectIndex.current.value;
        if (value !== 'NONE' && indexes.indexOf(value) === -1) {
            indexes.push(value);
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

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="form-group">
                        <label htmlFor="indexes">Indexes</label>
                        <div className="input-group input-group-merge">
                            <select id="indexes" ref={selectIndex} className="form-select" defaultValue="NONE">
                                <option value="NONE">None</option>
                                <option value="MACD">MACD - Moving Average Convergence Divergence</option>
                                <option value="RSI">RSI - Relative Strenght Index</option>
                            </select>
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