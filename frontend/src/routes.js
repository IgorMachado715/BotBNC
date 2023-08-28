import React from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import Login from "./public/Login/Login";
import Settings from "./private/Settings/Settings";


//definição de rota e componente renderizado para essa pagina
//abaixo cria-se rotas para paginas
function Routes(){
    return (
        <BrowserRouter>
            <Route path="/" exact>
                <Login /> 
            </Route>
            <Route path="/settings">
                <Settings />
            </Route>
        </BrowserRouter>
    )
}

export default Routes;