import React, { useMemo } from "react";

/**
 * props:
 * - wallet
 * - symbol
 */

function WalletSummary(props) {

    function getBaseAsset(){
        if(!props.wallet || !Array.isArray(props.wallet)) return 0;

    const baseAsset = props.wallet.find(w => w.symbol === props.symbol.base);
    if(!baseAsset) return 0;

    return `${props.symbol.base}: ${baseAsset.available}`;

    }

    function getQuoteAsset(){
        if(!props.wallet || !Array.isArray(props.wallet)) return 0;

    const quoteAsset = props.wallet.find(w => w.symbol === props.symbol.quote);
    if(!quoteAsset) return 0;

    return `${props.symbol.quote}: ${quoteAsset.available}`;

    }

    const walletSummary = useMemo(() => (
        <div className="row">
            <div className="col-md-6 mb-3">
                <div className="form-group">
                    <div className="alert alert-success py-1">
                        {getBaseAsset()}
                    </div>
                </div>
            </div>
            <div className="col-md-6 mb-3">
                <div className="form-group">
                    <div className="alert alert-info py-1">
                        {getQuoteAsset()}
                    </div>
                </div>
            </div>
        </div>
    ), [props.symbol, props.wallet]);

    return walletSummary;
        
    
}





export default WalletSummary;