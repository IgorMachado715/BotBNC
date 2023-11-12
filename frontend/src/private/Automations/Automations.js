import React, {useEffect, useState} from "react";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Menu from "../../components/menu/Menu";
import Pagination from "../../components/Pagination/Pagination";
import Footer from "../../components/Footer/Footer";
import AutomationRow from "./AutomationRow";
import { getAutomations, startAutomation, stopAutomation, deleteAutomation } from "../../services/AutomationsServices";
import AutomationModal from "./AutomationModal/AutomationModal";

function Automations() {

    const defaultLocation = useLocation();

    function getPage(location){
        if(!location) location = defaultLocation;
        return new URLSearchParams(location.search).get('page');
    }

    const history = useHistory();

    const [automations, setAutomations] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(getPage());

    const DEFAULT_AUTOMATION = {
        name: '',
        conditions: '',
        indexes: ''
    }
    const [editAutomation, setEditAutomation] = useState(DEFAULT_AUTOMATION);

    useEffect(() => {
        return history.listen(location => setPage(getPage(location)));
    }, [history])

    useEffect(() => {
        const token = localStorage.getItem('token');
        getAutomations(page || 1, token)
            .then(result => {
                setAutomations(result.rows);
                setCount(result.count);
            })
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }, [page])

   
    function onNewAutomationClick(event){
        setEditAutomation(DEFAULT_AUTOMATION);
    }

    function onEditAutomationClick(event){
        const id = event.target.id.replace('edit', '');
        const automation = automations.find((m) => m.id == id);
        setEditAutomation(automation);
    }

    function onStartAutomationClick(event){
        const id = event.target.id.replace('start', '');
        const token = localStorage.getItem('token');
        startAutomation(id, token)
            .then(automation => history.go(0))
            .catch(err => err.response ? err.response.data : err.message);
    }

    function onStopAutomationClick(event){
        const id = event.target.id.replace('stop', '');
        const token = localStorage.getItem('token');
        stopAutomation(id, token)
            .then(automation => history.go(0))
            .catch(err => err.response ? err.response.data : err.message);
    }

    function onDeleteAutomationClick(event){
        const id = event.target.id.replace('delete', '');
        const token = localStorage.getItem('token');
        deleteAutomation(id, token)
            .then(automation => history.go(0))
            .catch(err => err.response ? err.response.data : err.message);
    }

    function onAutomationSubmit(event){
        history.go(0);
    }

    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h2 className="h4">Automações</h2>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="d-inline-flex align-items-center">
                            <button id="btnNewAutomation" className="btn btn-primary animate-up-2" data-bs-toggle="modal" data-bs-target="#modalAutomation" onClick={onNewAutomationClick}>
                                <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                                    </path>
                                </svg>
                                Nova Automação
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="border-red-200">Símbolo</th>
                                <th className="border-red-200">Nome</th>
                                <th className="border-red-200">Ativos</th>
                                <th className="border-red-200">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                automations.map(automation => (<AutomationRow key={automation.id} data={automation} onEditClick={onEditAutomationClick} onStopClick={onStopAutomationClick} onStartClick={onStartAutomationClick} onDeleteClick={onDeleteAutomationClick} />))
                            }
                        </tbody>
                    </table>
                    <Pagination count={count} />
                </div>
                <Footer />
            </main>
            <AutomationModal data={editAutomation} onSubmit={onAutomationSubmit} />
        </React.Fragment>
    )
}

export default Automations;