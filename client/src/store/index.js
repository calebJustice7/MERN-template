import { createStore, combineReducers } from 'redux';
import serviceReducer from './reducers/serviceReducer';
import authReducer from './reducers/authReducer';

export let initState = {
    user: null,
    todos: [],
    cars: []
}

const reducer = combineReducers({
    service: serviceReducer,
    auth: authReducer
})

const store = createStore(reducer);

export default store;