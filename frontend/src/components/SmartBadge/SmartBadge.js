import React from "react";
import "./SmartBadge.css";
/**
 * props:
 * - id
 * - text
 * - onClick
 */
function SmartBadge(props){
    return(
        <div className="input-group me-2 d-flex flex-row flex-nowrap">
            <span id="spanNoWrap" className="alert alert-info py-1">
            {props.children} {props.text}
            </span>
            <button type="button" id={props.id} className="btn btn-info btn-xs alert" title="Clique para Remover" onClick={props.onClick}>
                X
            </button>
        </div>
    )
}

export default SmartBadge;