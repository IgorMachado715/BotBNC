import React, {useEffect, useState} from "react";
import { useLocation, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Menu from "../../components/menu/Menu";
import Pagination from "../../components/Pagination/Pagination";
import Footer from "../../components/Footer/Footer";
import {getMonitors} from "../../services/MonitorsService"
import MonitorRow from "./MonitorRow";
import MonitorModal from "./MonitorModal/MonitorModal";


function Monitor() {

    const defaultLocation = useLocation();

    function getPage(location){
        if(!location) location = defaultLocation;
        return new URLSearchParams(location.search).get('page');
    }

    const history = useHistory();

    useEffect(() => {
        return history.listen(location => {
            setPage(getPage(location));
        })
    }, [history])

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(getPage());

    const [monitors, setMonitors] = useState([]);
    const [editMonitor, setEditMonitor] = useState({
        type: 'CANDLES',
        interval: '1m',
        isActive: false,
        logs: false
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        getMonitors(page || 1, token)
        .then(result => {
            setMonitors(result.rows);
            setCount(result.count);
        })
        .catch(err => console.error(err.response ? err.response.data : err.message));
    },[page])

    function onEditClick(event){

    }

    function onStartClick(event){

    }

    function onStopClick(event){

    }

    function onDeleteClick(event){

    }

    function onModalSubmit(event){
        
    }

    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h2 className="h4">Monitores</h2>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="d-inline-flex align-items-center">
                            <button id="btnNewMonitor" className="btn btn-primary animate-up-2" data-bs-toggle="modal" data-bs-target="#modalMonitor" >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon icon-xs me-2">
                                    <path clipRule='evenodd' fillRule='evenodd' stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                                </svg>
                                Novo Monitor
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="border-red-200">Tipo</th>
                                <th className="border-red-200">Símbolo</th>
                                <th className="border-red-200">Ativos</th>
                                <th className="border-red-200">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                monitors.map(monitor => (
                                    <MonitorRow key={monitor.id} data={monitor} onEditClick={onEditClick} onStartClick={onStartClick} onStopClick={onStopClick} onDeleteClick={onDeleteClick} />
                                ))
                            }
                        </tbody>
                    </table>
                    <Pagination count={count} />
                </div>
                <Footer/>
            </main>
            <MonitorModal data={editMonitor} onSubmit={onModalSubmit}/>
        </React.Fragment>
    )
}

export default Monitor;