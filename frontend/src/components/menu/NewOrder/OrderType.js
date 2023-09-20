import React, { useMemo } from "react";

/**
 * props:
 * - type
 * - onChange
 */
function OrderType(props) {
    const orderType = useMemo(() => (
        <div className="form-group">
            <label htmlFor="type">Tipo:</label>
            <select id="type" className="form-select" defaultValue={props.type} onChange={props.onChange}>
                <option value="ICEBERG">Iceberg</option>
                <option value="LIMIT">Limite</option>
                <option value="MARKET">Mercado</option>
                <option value="STOP_LOSS">Stop loss</option>
                <option value="STOP_LOSS_LIMIT">Limite Stop Loss</option>
                <option value="TAKE_PROFIT">Take Profit</option>
                <option value="TAKE_PROFIT_LIMIT">Limite Take Profit</option>
            </select>
        </div>
    ), [props.type]);

    return orderType;
}

export default OrderType;