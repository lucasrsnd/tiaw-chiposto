const usuarioLogado = localStorage.getItem("usuarioLogado");

if (usuarioLogado == null) {
    window.location.href = "login.html";
} else {
    async function ObterPostos(i) {
        try {
            const response = await fetch(`https://jsonserver-tiaw-postos.gabrielarth30.repl.co/gasStations/${i}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro ao obter dados do servidor:", error);
            return null;
        }
    }

    async function carregarDadosDoUsuario() {
        const user = JSON.parse(usuarioLogado);
        console.log(user);

        const nomeUsuario = user.username;
        const emailUsuario = user.email;
        const senhaUsuario = user.password;
        const PostosUsuario = user.saved_gasstations;
        const numPostosUsuario = user.saved_gasstations.length;

        const usarnamespace = document.getElementById('nome-do-usuario');
        usarnamespace.innerHTML = nomeUsuario;

        const emailspace = document.getElementById('email-do-usuario');
        emailspace.innerHTML = emailUsuario;

        const numspace = document.getElementById('num-de-postos-usuario');
        numspace.innerHTML = `Número de Postos: ${numPostosUsuario}`;

        // Preencher o formulário com os dados do usuário
        document.getElementById('nome').value = nomeUsuario;
        document.getElementById('email').value = emailUsuario;
        document.getElementById('senha').value = senhaUsuario;

        for (const postoId of PostosUsuario) {
            const posto = await ObterPostos(postoId);
            if (posto) {
                console.log(posto);
                exibirPostos(posto);
            }
        }
    }

    function exibirPostos(posto) {
        const cardContainer = document.getElementById('card-container');
        const cardDiv = document.createElement('div');
        cardDiv.className = "card mb-3";

        cardDiv.innerHTML = `
            <div class="card-content">
                <div class="card-imagem">
                    <img id="card-imagem" src="${posto.photo_Url}">
                </div>
                <div class="conteudo-card">
                    <div class="card-title">${posto.name}</div>
                    <a class="btn-modal" target="_blank" href="https://maps.google.com/maps?q=${posto.coordinates[0]},${posto.coordinates[1]}">Ir</a>
                    <div class="card-description"><i class="fa-solid fa-location-dot"></i>${posto.location}</div>
                    <div class="avaliacao" id="avaliacoes-${posto.id}"></div>
                    <div class="slv-dth">
                        <button class="button-salve" onclick="toggleBookmark(this, ${posto.id})">
                            <i class="fa-solid fa-bookmark"></i>
                        </button>
                    </div>
                </div>

                <div class="button-container">
                    <p class="button">R$ ${posto.gas_Price}</p>
                </div>
            </div>
        `;

        cardContainer.appendChild(cardDiv);
    }

    function editarperfil() {
        // Obter os valores do formulário
        const novoNome = document.getElementById('nome').value;
        const novoEmail = document.getElementById('email').value;
        const novaSenha = document.getElementById('senha').value;

        // Verificar se todos os campos estão preenchidos
        if (!novoNome || !novoEmail || !novaSenha) {
            alert("Por favor, preencha todos os campos do formulário.");
            return;
        }

        const usuarioLogado = localStorage.getItem("usuarioLogado");

        if (usuarioLogado !== null) {
            const usuario = JSON.parse(usuarioLogado);
            const userId = usuario.id;

            const dadosAtualizados = {
                username: novoNome,
                email: novoEmail,
                password: novaSenha,
            };

            const url = `https://jsonserver-usuarios.gabrielarth30.repl.co/users/${userId}`;

            const options = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosAtualizados),
            };

            fetch(url, options)
                .then(response => response.json())
                .then(data => {
                    console.log("Usuário atualizado na API:", data);

                    // Atualizar o localStorage com os dados do usuário atualizados
                    localStorage.setItem("usuarioLogado", JSON.stringify(data));

                    // Fechar o modal
                    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
                    modal.hide();

                    // Recarregar os dados do usuário e postos após a atualização
                    location.reload();
                })
                .catch(error => console.error("Erro ao atualizar usuário na API:", error));
        } else {
            alert("Você precisa estar logado para editar o perfil.");
        }
    }

    function logout() {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "index.html";
    }

    carregarDadosDoUsuario();

    function toggleBookmark(button,id) {

        const usuarioLogado = localStorage.getItem("usuarioLogado");
    
        if (usuarioLogado !== null) {
            const iconBookmark = button.querySelector('i');
    
        // Verifica se a classe 'saved' está presente no ícone
        const isSaved = iconBookmark.classList.contains('fa-solid');
        if(isSaved){
        removerPostoSalvo(id);
        }
        else{
            adicionarPostoSalvo(id);
        }
        // Remove a classe atual do ícone
        iconBookmark.classList.remove(isSaved ? 'fa-solid' : 'fa-regular');
    
        // Adiciona a nova classe ao ícone
        iconBookmark.classList.add(isSaved ? 'fa-regular' : 'fa-solid');
        } else {
            alert("Você precisa estar logado para salvar postos.");
        }
    }
// Função para adicionar um posto aos salvos do usuário
function adicionarPostoSalvo(idPosto) {
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    if (usuarioLogado !== null) {
        const usuario = JSON.parse(usuarioLogado);

        if (!usuario.saved_gasstations.includes(idPosto)) {
            usuario.saved_gasstations.push(idPosto);

            // Atualizar a API JsonServer
            atualizarUsuario(usuario);
        } else {
            console.log(`Posto ${idPosto} já está nos salvos do usuário.`);
        }
    } else {
        alert("Você precisa estar logado para salvar postos.");
    }
}

// Função para remover um posto dos salvos do usuário
function removerPostoSalvo(idPosto) {
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    if (usuarioLogado !== null) {
        const usuario = JSON.parse(usuarioLogado);

        const index = usuario.saved_gasstations.indexOf(idPosto);
        if (index !== -1) {
            usuario.saved_gasstations.splice(index, 1);

            // Atualizar a API JsonServer
            atualizarUsuario(usuario);
        } else {
            console.log(`Posto ${idPosto} não encontrado nos salvos do usuário.`);
        }
    } else {
        alert("Você precisa estar logado para remover postos salvos.");
    }
}

function atualizarUsuario(usuario) {
    const url = `https://jsonserver-usuarios.gabrielarth30.repl.co/users/${usuario.id}`;

    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log("Usuário atualizado na API:", data);
            // Atualizar o localStorage com os dados do usuário atualizados
            localStorage.setItem("usuarioLogado", JSON.stringify(data));
        })
        .catch(error => console.error("Erro ao atualizar usuário na API:", error));
}

}
