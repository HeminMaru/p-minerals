import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v1.5.0";
import "assets/css/demo.css";

import AdminLayout from "layouts/Admin.js";

import AuthApi from "./AuthApi";
import Cookies from 'js-cookie';

function App() {
    const Auth = React.useContext(AuthApi);
    const [auth,SetAuth] = React.useState(false);

    const readCookie = () => {
        const user_uuid = Cookies.get("user_uuid");
        if(user_uuid){
            SetAuth(true);
        }
    }
    React.useEffect(()=> {
        readCookie();
    },[])

    return (
    <div>
        <AuthApi.Provider value={{auth,SetAuth}}>
            <BrowserRouter>
                <Switch>
                <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
                <Redirect to="/admin/login" />
                </Switch>
            </BrowserRouter>
        </AuthApi.Provider>
    </div>)
    }
export default App;
