import React, { useMemo } from "react";


/**
 * props:
 * - side
 * - onChange
 */
function SelectSide(props) {

    const SelectSide = useMemo(() => (
        <div className="form-group">
            <label htmlFor="side">Side:</label>
            <select id="side" className="form-select" defaultValue={props.side} onChange={props.onChange}>
                <option value="BUY">Comprar</option>
                <option value="SELL">Vender</option>
            </select>
        </div>
    ), [props.side]);

    return SelectSide;
}

export default SelectSide;