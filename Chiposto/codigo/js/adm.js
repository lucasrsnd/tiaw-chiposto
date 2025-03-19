const jsonUrl = 'https://jsonserver-tiaw-postos.gabrielarth30.repl.co/gasStations';

function adicionarPosto() {
    // Obtém os valores dos campos do formulário
    const name = document.getElementById('name').value;
    const photoUrl = document.getElementById('photoUrl').value;
    const gasPrice = parseFloat(document.getElementById('gasPrice').value);
    const location = document.getElementById('location').value;
    const latitude = parseFloat(document.getElementById('latitude').value) || 0.0;
    const longitude = parseFloat(document.getElementById('longitude').value) || 0.0;
    const features = document.getElementById('features').value.split(',').map(feature => feature.trim());
  
    // Realiza uma requisição para obter o JSON atualizado do servidor
    fetch('https://jsonserver-tiaw-postos.gabrielarth30.repl.co/gasStations')
      .then(response => response.json())
      .then(seuJson => {
        // Obtém o ID mais alto existente
        const ultimoId = seuJson.reduce((maxId, posto) => Math.max(maxId, posto.id), 0);
  
        // Cria um novo objeto de posto com um ID único
        const novoPosto = {
          id: ultimoId + 1,
          name: name,
          photo_Url: photoUrl,
          gas_Price: gasPrice,
          location: location,
          coordinates: [latitude, longitude],
          comments: [],
          features: features
        };
  
        // Adiciona o novo posto ao JSON
        seuJson.push(novoPosto);
  
        // Limpa os campos do formulário
        document.getElementById('addPostForm').reset();
  
        // Execute a lógica para enviar os dados atualizados de volta para o servidor
        const urlRecurso = 'https://jsonserver-tiaw-postos.gabrielarth30.repl.co/gasStations';
        const options = {
          method: 'POST', // Utilize 'POST' para adicionar um novo recurso
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoPosto),
        };
  
        fetch(urlRecurso, options)
          .then(response => response.json())
          .then(data => {
            console.log('Posto adicionado com sucesso:', data);
            // Execute qualquer lógica adicional necessária após adicionar o posto
            iniciar();
          })
          .catch(error => {
            console.error('Erro ao adicionar posto:', error);
          });
      })
      .catch(error => {
        console.error('Erro ao obter JSON do servidor:', error);
      });
  }
  
  function exibirPostosParaRemover() {
    const listaPostos = document.getElementById('listaPostos');
  
    // Limpa a lista antes de adicionar os postos
    listaPostos.innerHTML = '';
  
    // Faça uma solicitação GET para obter a lista de postos do servidor
    fetch('https://jsonserver-tiaw-postos.gabrielarth30.repl.co/gasStations')
      .then(response => response.json())
      .then(postos => {
        // Cria um item de lista para cada posto com um botão "Remover"
        postos.forEach(posto => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `${posto.name} <button type="button" class="btn btn-danger" onclick="removerPosto(${posto.id})">Remover</button>`;
          listaPostos.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Erro ao obter lista de postos:', error);
      });
  }

  function removerPosto(postoId) {
    fetch(`https://jsonserver-tiaw-postos.gabrielarth30.repl.co/gasStations/${postoId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Posto removido com sucesso:', data);
        // Atualize a lista após remover o posto
        exibirPostosParaRemover();
      })
      .catch(error => {
        console.error('Erro ao remover posto:', error);
      });
  }
