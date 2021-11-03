import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v1.5.0";
import "assets/css/demo.css";

import AdminLayout from "layouts/Admin.js";

import Login from "views/Login.js"

import { dashRoutes, subRoutes } from "routes.js";
import AuthApi from "AuthApi";

function Switchs() {
    const Auth = React.useContext(AuthApi)

    const ProtectedRoute = ({ auth, component: Component, ...rest }) => {
        return ( <
            Route {...rest }
            render = {
                () => auth ? ( <
                    Component / >
                ) : ( < div >
                    <
                    Redirect to = "/admin/login" / >
                    <
                    /div>
                )
            }
            />
        )
    };

    const ProtectedLogin = ({ auth, component: Component, ...rest }) => {
        return ( <
            Route {...rest }
            render = {
                () => !auth ? ( <
                    Component / >
                ) : ( <
                    div >
                    <
                    Redirect to = "/admin/daily-stocks" / >
                    <
                    /div>
                )
            }
            />
        )
    };

    return ( <
        div >
        <
        Switch > {
            dashRoutes.map((prop, key) => {
                return ( <
                    ProtectedRoute auth = { Auth.auth }
                    path = { prop.layout + prop.path }
                    component = { prop.component }
                    key = { key }
                    />
                );
            })
        } {
            subRoutes.map((prop, key) => {
                return ( <
                    Route auth = { Auth.auth }
                    path = { prop.layout + prop.path }
                    component = { prop.component }
                    key = { key }
                    />
                );
            })
        } <
        ProtectedLogin auth = { Auth.auth }
        path = "/admin/login"
        component = { Login }
        /> <
        Redirect from = "/admin"
        to = "/admin/daily-stocks" / >
        <
        /Switch> <
        /div>)
    }
    export default Switchs;