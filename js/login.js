let url = "https://script.google.com/macros/s/AKfycbxJ6dlJet3COlOnxZHQVVpI48673yo1mU6Cz8K04-yMncu041280AD3f8Tq4TXajU2V/exec";
function userLogin() {
    let name = document.getElementById("username");
    let password = document.getElementById("password");
    fetch(`${url}?action=read`)
    .then(res => res.json())
    .then(data => {
        data.data.forEach(row => {
            console.log(row.name)
            console.log(row.password)
            if (row.name == name.value && row.password == password.value) {
                console.log(row.name)
                alert("Login Success");
                window.location.href = "/html/dashboard.html";
                return;
            }
            else{
                console.log("Invalid username or password");
            }
        });
    })
}
function register() {
    let id = new Date();
    let name = document.getElementById("name");
    let username = document.getElementById("register_username");
    let password = document.getElementById("register_password");
    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    var params = {
        action: "insert",
        id: (id.getTime() - 1750990000000),
        name: name.value,
        username: username.value,
        password: password.value,
        email: email.value,
        phone: phone.value,
        role: "User"
      };
    fetch(url + "?" + new URLSearchParams(params), { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
        alert("Login Success");
        show_login();
    });
}
function show_login(){
    document.getElementById("register-container").style.display ="none";
    document.getElementById("login-container").style.display ="block";
}
function show_register(){
    document.getElementById("login-container").style.display ="none";
    document.getElementById("register-container").style.display ="block";
}