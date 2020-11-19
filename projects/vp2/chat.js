class Chat {
    constructor() {
        this.chatblock = {};
        this.usernick = {};
        this.username = {};
        this.userbar = {};
        this.currentuser = {};
        this.textinput = {};
        this.sendbtn = {};
        this.socket = {};
        this.message_template = {};
        this.user_template = {};
        this.system_template = {};
    }

    async init() {
        // инициализация обработчиков
        this.socket = await new WS((data) => {
            this.handleMessage(data)
        });
        this.sendbtn.addEventListener('click', () => this.sendMessage());
        this.textinput.addEventListener('keydown', (event) => {
            if (event.key == "Enter")
                this.sendMessage();
        });
        // шаблон сообщений
        this.messageTemp = Handlebars.compile(this.message_template);
        // шаблон системных сообщений
        this.systemTemp = Handlebars.compile(this.system_template);
        // шаблон пользователя в юзербаре
        this.userTemp = Handlebars.compile(this.user_template);
        this.fileReader = new FileReader();
        // Добавить текущего пользователя в юзербар
        this.addCurrent();
        // обновить аватары пользователей при обновлении страницы
        window.addEventListener("load", () => {
            this.getAvatars();
        });
    }

    addCurrent() {

        const newUser = document.createElement('div');
        this.userbar.prepend(newUser);
        newUser.outerHTML = this.userTemp({
            usernick: this.usernick
        });
        this.currentuser = this.userbar.firstElementChild;
        this.fileReader.addEventListener('load', () => {
            this.saveAvatar(this.fileReader.result);
        });
        // инициализация обработчика загрузки фото
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.currentuser.addEventListener(eventName, (e) => {
                e.preventDefault()
                e.stopPropagation()
            }, false)
        });
        this.currentuser.addEventListener('drop', (e) => {
            console.log(e);
            let file = e.dataTransfer.files[0];
            if (file) {
                if (file.size > 300 * 1024) {
                    alert('Слишком большой файл');
                } else {
                    this.fileReader.readAsDataURL(file);
                }
            }
        }, false);
    }

    addUser(user) {
        const newUser = document.createElement('div');
        this.userbar.append(newUser);
        newUser.outerHTML = this.userTemp({
            usernick: user
        });
    }

    delUser(user) {
        console.log('remove', user);
        var element = this.userbar.querySelector("div[data-user='" + user + "']");
        if (element)
            element.remove();
    }

    handleMessage(data) {
        let {type, message, user} = data;
        console.log('Recieved type:', type);
        console.log('Recieved user:', user);
        var content;
        var system = true;
        var time = new Date();
        time = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
        // определяем тип полученного сообщения
        switch (data.type) {
            case 'login':
                content =
                    {
                        time: time,
                        message: `Пользователь с ником: ${data.user} присоединился к чату`,
                    };
                // Добавляем пользователя в юзербар
                if (this.usernick != data.user)
                    this.addUser(data.user);
                // если получен аватар с сервера - обновляем его в чате
                if (data.avatar)
                    this.updateAvatar({
                        usernick: data.user,
                        avatar: data.avatar,
                    });
                break;
            case 'logout':
                content =
                    {
                        time: time,
                        message: `Пользователь с ником: ${data.user} покинул чат`,
                    };
                // Удаляем вышедшего из юзербара
                if ((this.usernick != {}) && (this.usernick != data.user))
                    this.delUser(data.user);
                break;
            case 'update_avatars':
                // обновляем все аватары в чате
                for (var usernick in data.avatars) {
                    this.updateAvatar({
                        usernick: usernick,
                        avatar: data.avatars[usernick],
                    });
                }
                break;
            case 'avatar':
                this.updateAvatar({
                    usernick: data.user,
                    avatar: data.avatar,
                });
                break;
            case'message':
                system = false;
                content =
                    {
                        direction: (this.usernick == data.user) ? 'out' : 'in',
                        imgsrc: (data.avatar) || "images/no_photo.jpg",
                        usernick: data.user,
                        time: time,
                        message: data.message,
                    };
                break;
            default:
                console.log('unknown type');
                return;
        }
        // добавляем сообщение в чат
        if (content) {
            const newMessage = document.createElement('div');
            this.chatblock.appendChild(newMessage);
            newMessage.outerHTML = system ? this.systemTemp(content) : this.messageTemp(content);
            this.chatblock.scrollTop = this.chatblock.scrollHeight - this.chatblock.clientHeight;
        }
    }

    // пользователь залогинился в чат
    async open() {
        var data = {
            user: this.usernick,
            message: '',
            type: 'login'
        };
        this.socket.sendSock(JSON.stringify(data));
        this.addCurrent();
    }

    // пользователь вышел из чата
    async close() {
        var data = {
            user: this.usernick,
            message: '',
            type: 'logout'
        };
        this.socket.sendSock(JSON.stringify(data));
        this.usernick = {};
        this.currentuser = this.userbar.firstElementChild;
        this.currentuser.remove();
    }

    // отправить сообщение на сервер
    async sendMessage() {
        var data = {
            user: this.usernick,
            message: this.textinput.value,
            type: 'message'
        };
        this.socket.sendSock(JSON.stringify(data));
        this.textinput.value = '';
    }

    // сохранить аватар на сервер
    async saveAvatar(image) {
        var data = {
            user: this.usernick,
            avatar: image,
            message: '',
            type: 'avatar'
        };
        this.socket.sendSock(JSON.stringify(data));
    }

    // запросить аватары на сервере
    async getAvatars() {
        console.log('usernick: ', this.usernick)
        var data = {
            user: this.usernick,
            message: '',
            type: 'getavatars'
        };
        this.socket.sendSock(JSON.stringify(data));
    }

    // обновить аватар у пользователя в чате
    async updateAvatar(user) {
        var elements = document.querySelectorAll("img[data-user='" + user.usernick + "']")
        // console.log(elements);
        for (let i = 0; i < elements.length; i++) {
            elements[i].src = user.avatar;
        }
    }

}