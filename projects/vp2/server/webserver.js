const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data.json');
const Storage = require('./storage');

const storage = new Storage();
var WebSocketServer = new require('ws');
var clients = {};
var webSocketServer = new WebSocketServer.Server({port: 8000});
webSocketServer.on('connection', function (ws) {
    var id = Math.random();
    clients[id] = ws;
    console.log("new connection " + id);
    ws.on('message', function (message) {
        console.log('message received ' + message);
        var received = JSON.parse(message);
        switch (received.type) {
            case "avatar":
                storage.saveUser(received)
                break;
            case "getavatars":
                var arAvatars = storage.getUsers();
                clients[id].send(JSON.stringify({type: "update_avatars", avatars: arAvatars}));
                return;
                break;
            case "login":
                var user_avatar = storage.getUser(received);
                if (user_avatar) {
                    console.log('found_avatar', user_avatar);
                    received.avatar = user_avatar;
                }
                break;
            case "message":
                var user_avatar = storage.getUser(received);
                if (user_avatar)
                    received.avatar = user_avatar;
                break;
            default:
        }
        for (var key in clients) {
            clients[key].send(JSON.stringify(received));
        }
    });
    ws.on('close', function () {
        console.log('connection closed' + id);
        delete clients[id];
    });
});
console.log("Server started at ports 8081");