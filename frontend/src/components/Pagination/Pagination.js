import React from "react";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const PAGE_SIZE = 10;

/**
 * props:
 * - count
 */

function Pagination(props){

    function useQuery(){
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery();

    function getPageClass(page){
        const queryPage = query.get('page');
        const isActive = queryPage == page || (!queryPage && page === 1);
        return isActive ? "page-item active" : "page-item";
    }

    function getPageLink(page){
        return `${window.location.pathname}?page=${page}`;
    }

    const pagesQty = Math.ceil(props.count / PAGE_SIZE);
    const pages = [];
    for(let i=1; i<= pagesQty; i++)
        pages.push(i);

    return(
        <div className="card-footer px-3 border-0 d-flex flex-column flex-lg-row align-items-center justify-content-between">
            <nav aria-label="Page Navigation">
                <ul className="pagination mb-0">
                    {
                        pages.map(p => (
                            <li key={p} className={getPageClass(p)}>
                                <Link className="page-link" to={getPageLink(p)}>{p}</Link>
                            </li>
                        ))
                    }
                </ul>
            </nav>
            <div className="fw-normal small mt-4 mt-lg-0">
                <b>
                    {props.count} resultados.
                </b>
            </div>
        </div>
    )

}

export default Pagination;