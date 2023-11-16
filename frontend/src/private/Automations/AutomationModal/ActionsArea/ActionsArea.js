import React, { useEffect, useState } from "react";
import ActionType from "./ActionType";
import ActionBadge from "./ActionBadge";


/**
 * props:
 * - actions
 * - onChange
 */
function ActionsArea(props) {

    const DEFAULT_ACTION = {
        type: 'ALERT_EMAIL',

    }

    const [newAction, setNewAction] = useState(DEFAULT_ACTION);
    const [actions, setActions] = useState([]);

    useEffect(() => {
        setActions(props.actions ? props.actions : []);
        setNewAction(DEFAULT_ACTION);
    }, [props.actions])

    function oninputChange(event) {
        setNewAction(prevState => ({
            ...prevState, [event.target.id]: event.target.value
        }));
        if (props.onChange) props.onChange(event);
    }

    function onAddClick(event) {
        const alreadExists = actions.some((a) => a.type === newAction.type);
        if(alreadExists) return;

        actions.push(newAction);
        setActions(actions);
        setNewAction(DEFAULT_ACTION);
        if(props.onChange) props.onChange({target: {id: 'actions', value: actions}});
    }

    function onRemoveAction(event) {
        const index = actions.find((a) => a.id === event.target.id);
        actions.splice(index, 1);
        if(props.onChange) props.onChange({ target: { id: 'actions', value: actions }});
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 my-3">
                    <div className="input-group input-group-merge">
                        <ActionType type={newAction.type} onChange={oninputChange} />
                        <button type="button" className="btn btn-secondary" onClick={onAddClick}>
                            <svg
                                className="icon icon-xs"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {
                actions && actions.length > 0
                    ? (
                        <div className="divScrollBadges">
                            <div className="d-inline-flex flex-row align-content-start">
                                {
                                    actions.map(action => (
                                        <ActionBadge
                                            key={action.type + ':' + action.id}
                                            action={action}
                                            onClick={onRemoveAction}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    )
                    : <React.Fragment></React.Fragment>
            }
        </React.Fragment>
    )
}

export default ActionsArea;