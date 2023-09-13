import React from "react";

/**
 * props.onClick
 * props.data:
 * - symbol
 * - basePrecision
 * - quotePrecision
 * - minNotional
 * - minLotSize
 * - isFavorite
 */

function SymbolRow(props) {
    return (
        <tr>
            <td className="text-gray-900">
                {props.data.symbol}
                {props.data.isFavorite ?
                    <svg className="icon icon-xs" xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 26 26" stroke-width="1.5" stroke="orange">
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    : <React.Fragment></React.Fragment>
                }
            </td>
            <td className="text-gray-900">
                {props.data.basePrecision}
            </td>
            <td className="text-gray-900">
                {props.data.quotePrecision}
            </td>
            <td className="text-gray-900">
                {props.data.minNotional}
            </td>
            <td className="text-gray-900">
                {props.data.minLotSize}
            </td>
            <td>
                <button id={"edit" + props.data.symbol} className="btn btn-secondary animate-up-2" width={32} data-bs-toggle="modal" data-bs-target="#modalSymbol" onClick={props.onClick}>
                    <svg id={"edit" + props.data.symbol} className="icon icon-xs" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" stroke-width="1.5" stroke="currentColor" onClick={props.onClick}>
                        <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>  

                </button>
            </td>
        </tr>
    );
}

export default SymbolRow;