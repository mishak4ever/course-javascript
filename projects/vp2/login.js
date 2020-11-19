const coockie_prefix = "chat.";

class LoginForm {
    constructor(form) {
        this.form = form;
        this.user = this.getUser();
        var login_button = this.form.querySelector('#login-btn');
        // var span = document.querySelector(".close");
        login_button.addEventListener('click', (e) => {
            const user = {
                name: this.form.querySelector('[data-role=user-name]').value,
                nick: this.form.querySelector('[data-role=user-nick]').value,
            };
            this.saveUser(user);
            this.closeForm();
        });
        if (!this.user.name) {
            this.popupForm()
        } else {
            chat.username = this.user.name;
            chat.usernick = this.user.nick;
            chat.chatblock.innerHTML = '';
        }
    }

    validateForm(user) {
        if (!user.name)
            throw new Error('empty_name');
        if (!user.nick)
            throw new Error('empty_nick');
    }

    getUser() {
        var user = {};
        var str = coockie_prefix + 'name';
        let match_name = document.cookie.match(new RegExp(
            "(?:^|; )" + str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        user.name = match_name ? decodeURIComponent(match_name[1]) : undefined
        var str = coockie_prefix + 'nick';
        let match_nick = document.cookie.match(new RegExp(
            "(?:^|; )" + str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        user.nick = match_nick ? decodeURIComponent(match_nick[1]) : undefined

        return user;
    }

    saveUser(user) {
        document.cookie = encodeURIComponent(coockie_prefix + 'name') + "=" + encodeURIComponent(user.name);
        document.cookie = encodeURIComponent(coockie_prefix + 'nick') + "=" + encodeURIComponent(user.nick);
        chat.username = user.name;
        chat.usernick = user.nick;
        console.log(user);
        chat.open();

    }

    popupForm() {
        this.form.style.display = "block";
    }

    closeForm() {
        this.form.style.display = "none";
        this.form.querySelector('[data-role=user-name]').value = '';
        this.form.querySelector('[data-role=user-nick]').value = '';
    }

    logout() {
        var cookie_date = new Date();  // Текущая дата и время
        cookie_date.setTime(cookie_date.getTime() - 1);
        document.cookie = encodeURIComponent(coockie_prefix + 'name') + "=; expires=" + cookie_date.toGMTString();
        document.cookie = encodeURIComponent(coockie_prefix + 'nick') + "=; expires=" + cookie_date.toGMTString();
        chat.close();
        this.popupForm();
    }


}
