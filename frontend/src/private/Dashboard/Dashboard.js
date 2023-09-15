import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Menu from '../../components/menu/Menu';
import LineChart from './LineChart';
import MiniTicker from './MiniTicker/MiniTicker';

function Dashboard() {

    const [miniTickerState, setTickerState] = useState({});

    const { lastJsonMessage } = useWebSocket(process.env.REACT_APP_WS_URL, {
        onOpen: () => console.log(`Connected to App WS`),
        onMessage: () => {
            if (lastJsonMessage) {
                if (lastJsonMessage.miniTicker) setTickerState(lastJsonMessage.miniTicker);

            }
        },
        queryParams: {},
        onError: (err) => console.error(err),
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000,

    })
    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">Dashboard</h1>
                    </div>
                </div>
                <LineChart />
                <MiniTicker data={miniTickerState} />
            </main>
        </React.Fragment>
    );
}

export default Dashboard;