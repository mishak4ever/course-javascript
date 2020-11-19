var logoutBtn = document.querySelector("#logout-btn");


const chat = new Chat();
// инициализируем класс чата
chat.textinput = document.querySelector('#message_input');
chat.chatblock = document.querySelector('#chat_section');
chat.sendbtn = document.querySelector('#send_btn');
chat.userbar = document.querySelector('#user_section');
chat.message_template = document.querySelector('#message').innerHTML;
chat.system_template = document.querySelector('#system-message').innerHTML;
chat.user_template = document.querySelector('#user_block').innerHTML;
chat.init();

// проверка на авторизацию
const login = new LoginForm(document.querySelector('#login-form'));

logoutBtn.addEventListener('click', (e) => {
    login.logout();
});
