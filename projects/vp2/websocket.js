class WS {
    constructor(fn) {
        // заменить на свой адрес сервера
        this.socket = new WebSocket("ws://localhost:8000");

        this.socket.onmessage = function (message) {
            fn(JSON.parse(message.data));
        };

        this.init();
    }

    init() {
        this.socket.addEventListener('error', function () {
            alert('Соединение закрыто или не может быть открыто');
        });
    }

    sendSock(message) {
        if (!this.socket.readyState) {
            setTimeout(() => {
                this.sendSock(message);
            }, 100);
        } else {
            this.socket.send(message);
        }
    }

}