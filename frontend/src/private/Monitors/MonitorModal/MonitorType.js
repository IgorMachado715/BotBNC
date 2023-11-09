import React, {useRef, useMemo, useEffect} from "react";

/**
 * props:
 * - type
 * - onChange
 */
function MonitorType(props){

    const selectRef = useRef('');

    useEffect(() => {
        selectRef.current.value = props.type;
        props.onChange({target: {id: 'type', value: props.type}});
    }, [props.type])

    const selectType = useMemo(() => {
        return(
            <div className="form-group">
                <label htmlFor="type">Tipo:</label>
                <select id="type" ref={selectRef} className="form-select" onChange={props.onChange} disabled={true}> 
                    <option value="BOOK">Book</option>
                    <option value="CANDLES">Candles</option>
                    <option value="MINI_TICKER">Mini Ticker</option>
                    <option value="USER_DATA">User Data</option>
                </select>
            </div>
        )
    }, [props.type])

    return selectType;
}

export default MonitorType;