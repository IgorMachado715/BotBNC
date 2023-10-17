import React from "react";

/**
 * props:
 * - data
 * - onClick
 */

function OrderRow(props) {

    function getDate(timestamp) {
        const date = new Date(timestamp);
        return Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(date);
    }

    function getStatusClass(status) {
        switch (status) {
            case 'PARTIALLY_FILLED': return 'text-info';
            case 'FILLED': return 'text-success';
            case 'REJECTED': return 'text-danger';
            case 'EXPIRED': return 'text-danger';
            case 'CANCELED': return 'text-danger';
            default: return 'fw-normal';
        }
    }

    return (
        <tr>
            <td>{props.data.symbol}</td>
            <td><span className="fw-normal">{getDate(props.data.transactTime)}</span></td>
            <td><span className="fw-normal">{props.data.side}</span></td>
            <td><span className="fw-normal">{props.data.quantity}</span></td>
            <td><span className="fw-bold">{props.data.net}</span></td>
            <td><span className={getStatusClass(props.data.status)}>{props.data.status}</span></td>
            <td>
                <button id={"view" + props.data.id} type="button" className="btn btn-info btn-xs" data-bs-toggle="modal" data-bs-target="#modalViewOrder" onClick={props.onClick}>
                    <svg className="icon icon-xs" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path fillRule="evenodd" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </td>
        </tr>
    )
}

export default OrderRow;