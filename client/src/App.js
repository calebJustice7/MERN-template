import React from 'react';
import { HashRouter as BrowserRouter, Route, Switch } from 'react-router-dom';
import services from './helpers/services';

class App extends React.Component {


    componentWillMount() {
        if (localStorage.getItem('JWT_PAYLOAD')) {
            services('users', 'auth');
        }
    }

    render() {
        return ( <
            div className = "app" >
            <
            BrowserRouter >
            <
            Switch >

            <
            /Switch> <
            /BrowserRouter> <
            /div>
        )
    }
}

export default App;