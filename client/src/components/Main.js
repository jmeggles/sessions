import React, { useEffect } from 'react'
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import { useDispatch } from "react-redux";
import { loadUser } from "../actions/authActions";
import NavBar from "././NavBar/NavBar";
import Home from "../pages/Home";
import UserDashboard from "../pages/UserDashboard";
import NewSesh from "../pages/NewSesh";
import MySesh from "../pages/MySesh";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import NoMatch from "../pages/NoMatch/index";

export const Main = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Router history={history}>
                <NavBar />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />     
                    <PrivateRoute path="/dashboard" component={UserDashboard} />
                    <PrivateRoute path="/mysesh" component={MySesh} />
                    <PrivateRoute path="/newsesh" component={NewSesh} />
                   
                    <Route component={NoMatch} />
                </Switch>
            </Router>
        </>
    )
}

export default Main;
