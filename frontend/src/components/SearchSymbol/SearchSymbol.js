import React from "react";


/**
 * props:
 * - placeholder
 * - onChange
 */
function SearchSymbol(props) {

    function getPlaceHolder(){
        return props.placeholder ? props.placeholder : "Procurar Símbolo";
    }

    return (
        <form className="navbar-search form-inline" id="navbar-search-main">
            <div className="input-group input-group-merge search-bar">
                <span className="input-group-text" id="topbar-addon">
                    <svg className="icon icon-xs" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path fillRule="evenodd" stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </span>
                <input type="text" className="form-control" id="search" placeholder={getPlaceHolder()} onChange={props.onChange} />
            </div>
        </form>

    )
}

export default SearchSymbol;