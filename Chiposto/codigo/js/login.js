const usuarioLogado = localStorage.getItem("usuarioLogado");

if (usuarioLogado !== null) {
    window.location.href = "user.html";

}
else{
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const sign_in_btn2 = document.querySelector("#sign-in-btn2");
const sign_up_btn2 = document.querySelector("#sign-up-btn2");
sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});
sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});
sign_up_btn2.addEventListener("click", () => {
    container.classList.add("sign-up-mode2");
});
sign_in_btn2.addEventListener("click", () => {
    container.classList.remove("sign-up-mode2");
});



function getUsersData() {
    return fetch('https://jsonserver-usuarios.gabrielarth30.repl.co/users')
        .then(response => response.json())
        .then(data => {
            console.log('Dados de usuários obtidos com sucesso:', data);
            return data;
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}

document.addEventListener("DOMContentLoaded", function () {

   

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        realizarLogin();
    });

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        cadastrarUsuario();
    });

    function realizarLogin() {
        const username = document.getElementById("usernameSignIn").value;
        const password = document.getElementById("passwordSignIn").value;

        getUsersData().then(usersData => {
            const usuario = usersData.find(user => user.email === username && user.password === password);

            if (usuario) {
                alert("Usuário logado com sucesso!");
                // Armazenar dados do usuário no local storage
                localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                window.location.href = "index.html";
            } else {
                alert("Usuário ou senha incorretos. Tente novamente.");
            }
        });
    }

    function cadastrarUsuario() {
        const username = document.getElementById("usernameSignUp").value;
        const email = document.getElementById("emailSignUp").value;
        const password = document.getElementById("passwordSignUp").value;

        getUsersData().then(usersData => {
            const usuarioExistente = usersData.find(user => user.email === email);

            if (usuarioExistente) {
                alert("E-mail já cadastrado. Por favor, escolha outro e-mail.");
            } else {
                const novoUsuario = {
                    username: username,
                    email: email,
                    password: password,
                    saved_gasstations: []
                };

                fetch('https://jsonserver-usuarios.gabrielarth30.repl.co/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(novoUsuario),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Usuário cadastrado com sucesso:", data);
                        alert("Usuário cadastrado com sucesso!");
                        limparFormularioSignup();
                        const container = document.querySelector(".container");
                        container.classList.add("sign-up-mode2");

                        container.classList.remove("sign-up-mode");

                    })
                    .catch(error => {
                        console.error("Erro ao cadastrar usuário:", error);
                        alert("Erro ao cadastrar usuário. Por favor, tente novamente.");
                    });
            }
        });
    }

    function limparFormularioSignup() {
        document.getElementById("usernameSignUp").value = "";
        document.getElementById("emailSignUp").value = "";
        document.getElementById("passwordSignUp").value = "";
    }
});
}