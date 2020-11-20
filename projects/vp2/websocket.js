class WS {
    constructor(fn) {
            // заменить на свой адрес сервера
            this.socket = new WebSocket("ws://localhost:8000");
            if (!this.socket) {
                throw new Error("Ошибка подключения к серверу");
            }
            this.socket.onmessage = function (message) {
                fn(JSON.parse(message.data));
            };
            this.init();
    }

    init() {
         try {
            this.socket.addEventListener('error', function () {
                throw new Error("Ошибка подключения к серверу");
                alert('Ошибка подключения к серверу');
            });
        } catch (e) {
            throw new Error("Ошибка инициализации сокета");
        }
    }

    sendSock(message) {
        try {
            if (!this.socket.readyState) {
                setTimeout(() => {
                    this.sendSock(message);
                        }, 100);
            } else {
                this.socket.send(message);
            }
        } catch (e) {
            throw new Error("Ошибка отправки данных");
        }
    }

}