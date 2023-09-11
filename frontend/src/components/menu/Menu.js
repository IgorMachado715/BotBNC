import React from 'react';
import NavBar from './NavBar';
import Sidebar from './SideBar';

function Menu(){
    return(
        <React.Fragment>
            <NavBar />
            <Sidebar/>
        </React.Fragment>
    )
}
export default Menu;