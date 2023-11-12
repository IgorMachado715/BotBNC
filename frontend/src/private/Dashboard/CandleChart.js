import React, {useState, useEffect, useMemo} from "react";
import "./Dashboard.css";

/**
 * props:
 * - symbol
 */

function CandleChart(props){
    const [widget, setWidget] = useState({});

    useEffect(() => {
        
        const w = new window.TradingView.widget({
            symbol: "BINANCE:" + props.symbol,
            autosize: true,
            interval: "1",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            hide_side_toolbar: false,
            enable_pubishing: false,
            allow_symbol_change: false,
            details: true,
            withdateranges: true,
            studies: ["RSI@tv-basicstudies"],
            container_id: "tradingview_d34df"
        });
        setWidget(w);

    }, [props.symbol]);

    const widgetHtml = useMemo(() => (
        <div className="row">
            <div className="col-12 mb-4">
                <div className="card-body-p2 card cardDark border-0 shadow">
                    <div className="tradingview-widget-container">
                        <div id="tradingview_d34df" className="divTradingView">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),[props.symbol]);

    return widgetHtml;
}

export default CandleChart;