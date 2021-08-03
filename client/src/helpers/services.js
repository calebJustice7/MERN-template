import store from '../store/index';
import actions from './actions';
import decode from 'jwt-decode';

export default (service, action, data = {}) => {
    if (action === 'find') {
        return new Promise((resolve, reject) => {
            actions(service, data, action).then(res => {
                if (res) {
                    store.dispatch({
                        type: `${service}/${action}`,
                        payload: res.data,
                        service,
                    });
                    resolve(res);
                } else {
                    resolve(res);
                }
            }).catch(e => reject(e));
        });
    } else if (action === 'create') {
        return new Promise((resolve, reject) => {
            actions(service, data, action).then(res => {
                resolve(res);
            }).catch(e => reject(e));
        });
    } else if (action === 'auth') {
        // IF trying to get user from JWT stored in localStorage;
        if (Object.keys(data).length === 0) {
            return new Promise((resolve, reject) => {
                let data = localStorage.getItem('JWT_PAYLOAD');
                if (!data) {
                    resolve({ data: { success: false, message: 'No User Signed In' } });
                    return;
                }
                let decoded = decode(data);
                let exp = decoded.exp;
                let expired = new Date(exp * 1000) < new Date();

                if (expired && data) {
                    store.dispatch({
                        type: 'users/logout',
                    });
                    localStorage.removeItem('JWT_PAYLOAD');
                    return false;
                }
                actions('users', { _id: decoded.id }, 'find').then(res => {
                    store.dispatch({
                        type: 'users/auth',
                        user: res.data,
                    });
                    resolve({ data: res });
                }).catch(err => {
                    reject(err)
                    store.dispatch({
                        type: 'users/logout',
                    });
                    localStorage.removeItem('JWT_PAYLOAD');
                    return false;
                });
            });
            // If trying to authenticate user with email and password
        } else {
            return new Promise((resolve, reject) => {
                actions(service, data, action).then(res => {
                    if (res.data && res.data.token) {
                        localStorage.setItem('JWT_PAYLOAD', res.data.token);
                        store.dispatch({
                            type: 'users/auth',
                            user: res.data.user,
                        });
                        resolve(res);
                    } else {
                        resolve(res);
                    }
                }).catch(err => {
                    console.error(err);
                    reject('Err');
                });
            });
        }
    } else if (action === 'logout') {
        store.dispatch({
            type: 'users/logout',
        });
        localStorage.removeItem('JWT_PAYLOAD');
    } else if (action === 'getId') {
        let data = localStorage.getItem('JWT_PAYLOAD');
        if (!data) return '';
        let decoded = decode(data);
        return decoded.id;
    }
}