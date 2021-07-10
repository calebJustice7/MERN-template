import React from 'react';
import {HashRouter as BrowserRouter, Route, Switch} from 'react-router-dom';
import Auth from './components/Auth';
import Todo from './components/Todo';
import services from './helpers/services';

class App extends React.Component {
    
    
    componentWillMount() {
        if (localStorage.getItem('JWT_PAYLOAD')) {
            services('users', 'auth');
        }
    }
    
    render() {
        return (
            <div className="app">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Auth} />
                        <Route exact path="/todos" component={Todo} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;
