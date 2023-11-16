import React, { useEffect, useRef, useState } from "react";
import SelectSymbol from '../../../components/SelectSymbol/SelectSymbol';
import ConditionsArea from "./ConditionsArea/ConditionsArea";
import ActionsArea from "./ActionsArea/ActionsArea";
import SwitchInput from "../../../components/SwitchInput/SwitchInput";
import {saveAutomation} from "../../../services/AutomationsServices";
import { getIndexes } from "../../../services/BotService";
import '../Automations.css'

/**
 * props:
 * - data
 * - onSubmit
 */

function AutomationModal(props) {

    const [indexes, setIndexes] = useState([]);
    const [symbol, setSymbol] = useState({});
    const [error, setError] = useState('');

    const DEFAULT_AUTOMATION = {
        name: "",
        symbol: "",
        indexes: [],
        conditions: "",
        schedule: "",
        actions: [],
      };

      const [automation, setAutomation] = useState(DEFAULT_AUTOMATION);

    const btnClose = useRef('');

    const btnSave = useRef('');

    function onSubmitClick(event) {
        const token = localStorage.getItem('token');
        saveAutomation(automation.id, automation, token)
        .then(result => {
            btnClose.current.click();
            if(props.onSubmit) props.onSubmit(result);
        })
        .catch(err => {
            console.error(err.response ? err.response.data : err.message);
            setError(err.response ? err.response.data : err.message);
        })
    }

    function onInputChange(event) {
        setAutomation(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    useEffect(() => {
        if (!props.data) return;
        setAutomation(props.data);
      }, [props.data]);

    useEffect(() => {
        if(!automation || !automation.symbol) return;

        const token = localStorage.getItem('token'); 
        getIndexes(token)
            .then(indexes => {
                const filteredIndexes = indexes.filter(k => k.symbol === automation.symbol);
                const baseWallet = indexes.find(ix => ix.variable === 'WALLET' && automation.symbol.startsWith(ix.symbol));
                if(baseWallet) filteredIndexes.splice(0, 0, baseWallet);

                const quoteWallet = indexes.find(ix => ix.variable === 'WALLET' && automation.symbol.endsWith(ix.symbol));
                if(quoteWallet) filteredIndexes.splice(0, 0, quoteWallet);
                
                setIndexes(filteredIndexes);
            })
            .catch(err => err.response ? err.response.data : err.message);
    }, [automation.symbol])

    return (
        <div className="modal fade" id="modalAutomation" tabIndex="-1" role="dialog" aria-labelledby="modalTitleNotify" aria-hidden="true" >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title" id="modalTitleNotify">{props.data.id ? 'Editar ' : 'Nova '}Automação</p>
                        <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="symbol">Símbolo:</label>
                                    <SelectSymbol onChange={onInputChange} symbol={automation.symbol} onlyFavorites={false} />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label htmlFor="name">Nome:</label>
                                   <input type="text" className="form-control" id="name" placeholder="Nome da minha Estratégia" defaultValue={automation.name} required={true} onChange={onInputChange} />
                                </div>
                            </div>
                        </div>
                        <ul className="nav nav-tabs" id="tabs" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="conditions-tab" data-bs-toggle="tab" data-bs-target="#conditions" type="button" role="tab" aria-controls="conditions" aria-selected="true" >
                                    Condições
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="actions-tab" data-bs-toggle="tab" data-bs-target="#actions" type="button" role="tab" aria-controls="actions" aria-selected="true" >
                                    Ações
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content px-3 mb-3" id="tabContent">
                                <div className="tab-pane fade show active pt-3" id="conditions" role="tabpanel" aria-labelledby="conditions-tab">
                                    <ConditionsArea indexes={indexes} conditions={automation.conditions} onChange={onInputChange} symbol={automation.symbol} />
                                </div>
                                <div className="tab-pane fade" id="actions" role="tabpanel" aria-labelledby="actions-tab">
                                    <ActionsArea actions={automation.actions} onChange={onInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="form-group">
                                        <SwitchInput id="isActive" text="Está Ativo?" onChange={onInputChange} isChecked={automation.isActive} />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group">
                                        <SwitchInput id="logs" text="Existe Logs?" onChange={onInputChange} isChecked={automation.logs} />
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div className="modal-footer">
                        {
                            error
                                ? <div className="alert alert-danger mt-1 col-9 py-1">{error}</div>
                                : <React.Fragment></React.Fragment>
                        }
                        <button ref={btnSave} type="button" className="btn btn-sm btn-primary" onClick={onSubmitClick}>Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AutomationModal;