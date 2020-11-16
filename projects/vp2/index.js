var logoutBtn = document.querySelector("#logout-btn");

const login = new LoginForm(document.querySelector('#login-form'));

logoutBtn.addEventListener('click', (e) => {
    login.logout();
});
