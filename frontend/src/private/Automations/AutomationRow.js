import React from "react";

/**
 * props:
 * - data
 * - onEditClick
 * - onStopClick
 * - onStartClick
 * - onDeleteClick
 */

function AutomationRow(props) {

    function getActiveClass(isActive) {
        return isActive ? "text-success" : "text-danger";
    }

    function getActiveText(isActive) {
        return isActive ? "ATIVO" : "INATIVO";
    }

    return (
        <tr>
            <td>
                {props.data.symbol}
            </td>
            <td>
                {props.data.name}
            </td>
            <td>
                <span className={getActiveClass(props.data.isActive)}>
                    {getActiveText(props.data.isActive)}
                </span>
            </td>
            <td>
                {
                    <button id={"edit" + props.data.id} type="button" className="btn btn-secondary btn-xs ms-2" title="Editar essa Automação" data-bs-toggle="modal" data-bs-target="#modalAutomation" onClick={props.onEditClick}>
                    <svg className="icon icon-xs" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" stroke-width="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeWidth={1} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </button>
                }
                {
                    props.data.isActive
                        ? <button id={"stop" + props.data.id} type="button" className="btn btn-danger btn-xs ms-2" title="Parar essa Automação" onClick={props.onStopClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon icon-xs">
                                <path fillRule="evenodd" stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path fillRule="evenodd" stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                            </svg>
                        </button>
                        : <React.Fragment></React.Fragment>
                }
                {
                    !props.data.isActive 
                        ? <button id={"start" + props.data.id} type="button" className="btn btn-success btn-xs ms-2" title="Iniciar essa Automação" onClick={props.onStartClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon icon-xs">
                                <path fillRule="evenodd" stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path fillRule="evenodd" stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                            </svg>
                        </button>
                        : <React.Fragment></React.Fragment>
                }
                {
                    !props.data.isActive 
                        ? <button id={"delete" + props.data.id} type="button" className="btn btn-danger btn-xs ms-2" title="Deletar essa Automação" onClick={props.onDeleteClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon icon-xs">
                                <path fillRule="evenodd" stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                        : <React.Fragment></React.Fragment>
                }
            </td>
        </tr>
    )
}

export default AutomationRow;