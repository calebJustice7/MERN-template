import axios from 'axios';
import socketClient from "socket.io-client";

let socketUrl = 'http://localhost:9000';
let socket = socketClient(socketUrl);

let querys = {};

// socket.on('todos', () => {
//     services('todos', 'find', querys['todos'] || {});
// })

export default async(service, query, type) => {
    if (type === 'find') {
        querys[service] = query;
        let data;
        try {
            await axios.post(`/api/${service}`, { query }).then(res => {
                data = res.data;
            })
            return data;
        } catch (e) {
            throw new Error('Error finding on service ' + service + ' ', e);
        }
    } else if (type === 'create') {
        let data;
        try {
            data = await axios.post(`/api/${service}/${service === 'users' ? 'register' : 'create'}`, {...query });
            socket.emit(service);
            return data.data;
        } catch (e) {
            throw new Error('Error creating on service ' + service + ' ', e);
        }
    } else if (type === 'auth') {
        let data;
        try {
            data = await axios.post(`/api/users/login`, query);
            return data;
        } catch (e) {
            throw new Error('Error authenticating user ', e);
        }
    }
}