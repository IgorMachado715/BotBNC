import React from "react";

/**
 * props:
 * - data
 */

function BookTicker(props){
    return (
        <React.Fragment>
            {`${JSON.stringify(props.data)}`}
        </React.Fragment>
    );
}

export default BookTicker;