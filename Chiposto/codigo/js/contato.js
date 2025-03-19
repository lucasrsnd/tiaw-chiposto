// Função para excluir um item da lista
function deleteItem(index) {
    var storedData = JSON.parse(localStorage.getItem('contactData')) || [];
    
    // Remove o item pelo índice
    storedData.splice(index, 1);

    // Atualiza o localStorage
    localStorage.setItem('contactData', JSON.stringify(storedData));

    // Atualiza a lista de dados exibidos
    updateContactList();
}

// Função para editar um item da lista

function updateContactList() {
    // Obter a lista HTML
    var contactList = document.getElementById('contactList');

    // Limpar a lista existente
    contactList.innerHTML = '';

    // Obter os dados do localStorage
    var storedData = JSON.parse(localStorage.getItem('contactData')) || [];

    // Iterar sobre os dados e adicioná-los à lista
    storedData.forEach(function (data, index) {
        var listItem = document.createElement('li');
        listItem.innerHTML = `<strong>Nome:</strong><p>${data.name}</p><strong>Email:</strong><p>${data.email}</p><strong>Sugestão:</strong><p>${data.suggestion}</p>
            <div class="action-buttons">
                <button class="delete-button" onclick="deleteItem(${index})">Excluir</button>
            </div>`;
        contactList.appendChild(listItem);
    });
}

// Exibir dados existentes ao carregar a página
updateContactList();