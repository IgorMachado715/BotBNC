import React, { useRef, useState, useEffect } from "react";
import SmartBadge from "../../../components/SmartBadge/SmartBadge";
import { getAnalysisIndexes } from "../../../services/BotService";

/**
 * props:
 * - indexes
 * - onChange
 */
function MonitorIndex(props) {

    const btnAddIndex = useRef('');
    const selectIndex = useRef('');
    const inputPeriod = useRef('');

    const [analysis, setAnalysis] = useState({});

    const [indexes, setIndexes] = useState([]);

    useEffect(() => {
        if (props.indexes) {
            setIndexes(props.indexes ? props.indexes.split(",") : []);
        } else setIndexes([]);
    }, [props.indexes]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        getAnalysisIndexes(token)
            .then(result => setAnalysis(result))
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }, [])

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

    function onIndexChange(event) {
        if (event.target.value === 'NONE') return;
        const { params } = analysis[event.target.value];
        inputPeriod.current.placeholder = params;
        if (params === 'NONE')
            inputPeriod.current.className = 'd-none';
        else
            inputPeriod.current.className = 'form-control';
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
                                {
                                    analysis && Object.entries(analysis)
                                        .sort((a, b) => {
                                            if (a[0] > b[0]) return 1;
                                            if (a[0] < b[0]) return -1;
                                            return 0;
                                        })
                                        .map(props => (<option key={props[0]} value={props[0]}>{props[1].name}</option>))

                                }
                            </select>
                            <input ref={inputPeriod} type="text" id="params" placeholder="params" className="d-none" />
                            <button type="button" className="btn btn-secondary" ref={btnAddIndex} onClick={onAddIndexClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon icon-xs">
                                    <path fillRule="evenodd" stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="divScrollBadges">
                <div className="d-inline-flex align-content-start">
                    {
                        indexes.map((ix) => (
                            <SmartBadge key={ix} id={"ix" + ix} text={ix} onClick={onRemoveIndex} />
                        ))
                    }
                </div>
            </div>

        </React.Fragment>
    )
}

export default MonitorIndex;