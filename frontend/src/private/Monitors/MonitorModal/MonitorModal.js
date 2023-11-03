import React, {useRef, useState} from "react";

/**
 * props:
 * - data
 * - onSubmit
 */

function MonitorModal(props){

    const [error, setError] = useState('');

    const btnClose = useRef('');
    const btnSave = useRef('');

    function onSubmit(event){
        props.onSubmit(event);
    }

    return(
        <div className="modal fade" id="modalMonitor" tabIndex="-1" role="dialog" aria-labelledby="modalTitleNotify" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title" id="modalTitleNotify">{props.data.id ? 'Edit':'New'}Monitor</p>
                        <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div className="modal-body">

                    </div>
                    <div className="modal-footer">
                        {
                            error
                            ? <div className="alert alert-danger mt-1 col-9 py-1">{error}</div>
                            :<React.Fragment></React.Fragment>
                        }
                        <button ref={btnSave} type="button" className="btn btn-sm btn-primary" onClick={onSubmit}>Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default MonitorModal;