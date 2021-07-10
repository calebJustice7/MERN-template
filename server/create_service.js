const readline = require("readline");
const fs = require('fs');
const {model, route} = require('./config/defaultsService');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("What is the serivice name? ", async function(name) {
    rl.question("Does this require authentication? Y/N ? ", async function(req) {
        console.log("\nCreating service...\n");
        let requiresAuth = req === 'y' || req === 'Y' ? true : false;
        await createFile('/models', name + '.js', model(name, requiresAuth));
        await createFile('/routes', name + '.js', route(name, requiresAuth));
        await modifyIndex('./routes/', name); 
    });
});

const createFile = (filePath, fileName, content) => {
    fs.writeFile(process.cwd() + filePath + '/' + fileName, content, (err) => {
        if (err) {
            console.log('Error occured creating file', err);
        } else {
            console.log(fileName + ' created\n');
        }
    })
}

rl.on("close", function() {
    console.log("Service Created\n");
    process.exit(0);
});

const modifyIndex = (filePath, name) => {
    fs.readFile(process.cwd() + '/index.js', 'utf8', (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        let newData = data;
        let idx = newData.indexOf('const port = process.env.PORT || 9000');
        let first = newData.slice(0, idx);
        let middle = `app.use('/api/${name}/', require('./routes/${name}.js'));\n\n`;
        let last = newData.slice(idx, newData.length - 1);

        newData = first + middle + last;

        let idxS = newData.indexOf("socket.on('users', data => {")
        let firstS = newData.slice(0, idxS);
        let middleS = `
        socket.on('${name}', data => {
            io.emit('${name}', data);
        })\n`
        let lastS = newData.slice(idxS, newData.length - 1);

        fs.writeFile(process.cwd() + '/index.js', (firstS + middleS + lastS + '})'), (err) => {
            if (err) {
                console.log('Error Occured updating index.js file', err);
            } else {
                console.log(name + '.js created\n');
            }
            rl.close();
        })
    })
}
