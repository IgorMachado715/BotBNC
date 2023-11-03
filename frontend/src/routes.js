import React from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import Login from "./public/Login/Login";
import Settings from "./private/Settings/Settings";
import Dashboard from "./private/Dashboard/Dashboard";
import Orders from "./private/Orders/Orders";
import Monitors from "./private/Monitors/Monitors";

//definição de rota e componente renderizado para essa pagina
//abaixo cria-se rotas para paginas
function Routes() {

    function PrivateRoute({ children, ...rest }) {
        return (
            <Route {...rest} render={() => {
                return localStorage.getItem('token')
                    ? children
                    : <Redirect to="/" />
            }} />


        )
    }

    return (
        <BrowserRouter>
            <Route path="/" exact>
                <Login />
            </Route>
            <PrivateRoute path="/settings">
                <Settings />
            </PrivateRoute>
            <PrivateRoute path="/dashboard">
                <Dashboard />
            </PrivateRoute>
            <PrivateRoute path="/monitors">
                <Monitors />
            </PrivateRoute>
            <PrivateRoute path="/orders/:symbol?">
                <Orders />
            </PrivateRoute>
        </BrowserRouter>
    )
}

export default Routes;