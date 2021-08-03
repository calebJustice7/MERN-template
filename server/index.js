// ENVS REQUIRED: 

// PORT
// DEV_CLIENT_URL
// PROD_CLIENT_URL
// ALLOW_ANY_SOCKET_CONN
// CLOUD_NAME,
// CLOUD_API_SECRET,
// CLOUD_API_KEY
// MONGO_URI
// APP_SECRET

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const socket = require('socket.io');
const Users = require('./routes/users');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cors());
app.use(helmet());

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    }).then(() => console.log('Connection established to Database, URI:: ', mongoURI))
    .catch(err => console.log('Error connecting to mongoose database: ', err));

require('./config/passport')(passport);
app.use(passport.initialize());

app.use('/api/users/', Users);

app.use('/api/todos/', require('./routes/todos.js'));

const port = process.env.PORT || 9000;
let server = app.listen(port, () => console.log('Server started, running on port ', port));
let clientUrl = process.env.DEV_CLIENT_URL || 'http:localhost:3000';

if (process.env.NODE_ENV === 'prod') {
    clientUrl = process.env.PROD_CLIENT_URL;
}

let io = socket(server, {
    cors: {
        origin: process.env.ALLOW_ANY_SOCKET_CONN == 'true' ? '*' : clientUrl,
    },
});

io.sockets.on('connection', (socket) => {
    socket.on('connection', () => {
        console.log('A connection was made via socket!');
    });

    
        socket.on('todos', data => {
            io.emit('todos', data);
        })
socket.on('users', data => {
        io.emit('users', data);
    });

})