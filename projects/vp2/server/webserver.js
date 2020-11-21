const Storage = require('./storage');

const storage = new Storage();
var WebSocketServer = new require('ws');
var clients = {};
var clients_name = {};
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
            case "login":
                clients_name[id] = received.user;
                var user_avatar = storage.getUser(received);
                if (user_avatar) {
                    received.avatar = user_avatar;
                }
                break;
            case "im_in_chat":
                clients_name[id] = received.user;
                var user_avatar = storage.getUser(received);
                if (user_avatar) {
                    received.avatar = user_avatar;
                }
                break;
            case "message":
                clients_name[id] = received.user;
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
        const message =
            {
                user: clients_name[id],
                type: "logout",
            };
        for (var key in clients) {
            clients[key].send(JSON.stringify(message));
        }
    });
});
console.log("Server started at ports 8081");