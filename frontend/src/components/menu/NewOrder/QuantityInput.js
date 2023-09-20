import React, { useMemo, useRef } from "react";


/**
 * props:
 * - id
 * - text
 * - wallet
 * - price
 * - symbol
 * - side
 * - onChange
 */
function QuantityInput(props) {

    const inputQuantity = useRef('');

    function onCalcClick(event) {
        //if (!props.wallet || !Array.isArray(props.wallet)) return;

        let qty;

        if (props.side === 'SELL') {
            const baseAsset = props.wallet.find(w => w.symbol === props.symbol.base);
            if (!baseAsset) return;
            qty = parseFloat(baseAsset.available);
        } else {

            const quoteAsset = props.wallet.find(w => w.symbol === props.symbol.quote);
            if (!quoteAsset) return;

            const quoteAmount = parseFloat(quoteAsset.available);
            if (!quoteAmount) return;
            qty = quoteAmount / parseFloat(props.price);

        }

        
        if (!qty) return;

        inputQuantity.current.value = `${qty}`.substring(0, 8);
        if (props.onChange)
            props.onChange({ target: { id: props.id, value: inputQuantity.current.value } });

    }

    const quantityInput = useMemo(() => (
        <div className="form-group">
            <label htmlFor={props.id}>{props.text}</label>
            <div className="input-group">
                <button type="button" className="btn btn-secondary d-inline-flex align-items-center" onClick={onCalcClick} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon icon-xs">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                    </svg>
                </button>
                <input type="number" id={props.id} ref={inputQuantity} className="form-control" placeholder={props.symbol.minLotSize} onChange={props.onChange} required />
            </div>
        </div>
    ), [props.wallet, props.price, props.symbol, props.side]);

    return quantityInput;
}

export default QuantityInput;


