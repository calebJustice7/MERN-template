import { initState } from '../index';

// const serviceName = 'todos';

const cCase = (str) => {
    if (!str) return str;
    let newStr = str;
    if (str.indexOf('-') !== -1) {
        let finalStr = str; 
        let dash = str.indexOf('-');
        newStr = str.replace('-', '');
        let arr = newStr.split('');
        arr[dash] = arr[dash].toUpperCase();
        finalStr = arr.join('');
        return finalStr;
    } else {
        return str;
    }
}

const todoReducer = (state = initState, action) => {
    if(action.type === `${action.service}/find`) {
        return {
            ...state,
            [cCase(action.service)]: action.payload || []
        }
    }
    else {
        return {
            ...state
        };
    }
}

export default todoReducer;