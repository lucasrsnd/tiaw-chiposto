function submitForm() {
    // Obter os valores dos campos
    var name = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var suggestion = document.getElementById('descricao').value;

    // Criar um objeto com os dados
    var contactData = {
        name: name,
        email: email,
        suggestion: suggestion
    };

    // Obter os dados existentes do localStorage ou inicializar um array vazio
    var existingData = JSON.parse(localStorage.getItem('contactData')) || [];

    // Adicionar os novos dados ao array
    existingData.push(contactData);

    // Armazenar o array atualizado de volta no localStorage
    localStorage.setItem('contactData', JSON.stringify(existingData));

    // Limpar os campos do formulário
    document.getElementById('contactForm').reset();

    // Exibir mensagem de agradecimento
    alert("Obrigado por entrar em contato, retornaremos no e-mail em breve!");
}

function loginAsAdmin() {
    // Implementar uma autenticação simples (pode ser ajustada conforme necessário)
    var adminPassword = prompt('Digite a senha de administrador:');

    // Verificar se a senha de administrador está correta
    if (adminPassword === 'chiposto') {
        // Redirecionar para a página de dados
        window.open('dados.html', '_blank');
    } else {
        alert('Senha de administrador incorreta.');
    }
}