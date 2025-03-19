let apiUrl;
let dadosDaApi;
var formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", function(event) {
      event.preventDefault();
    });

document.getElementById('posto-search').addEventListener('keyup', function() {
   const valorpesquisado = encodeURIComponent(this.value); 
   apiUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+valorpesquisado+'.json?proximity=ip&access_token=pk.eyJ1IjoiZ2FiYXJ0aCIsImEiOiJjbHBxOGhlZzAwc2lrMm1xdG85OGFjZnh4In0.2qPfraZ4FJZfQSV7nDoGig';
   atualizarValor(apiUrl);
  });
function atualizarValor(valor){
    console.log(valor);
    fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    return response.json();
  })
  .then(data => {
    
    dadosDaApi = data;

    processarDados(dadosDaApi);
  })
  .catch(error => {

    console.error('Erro:', error);
  });

// Função para processar os dados (pode ser chamada de qualquer lugar no código)

}

function processarDados(data) {
  const containerDiv = document.querySelector('.enderecos-container');
  containerDiv.innerHTML = '';
  console.clear();
  console.log('Dados processados:', data.features);
  for (let i = 0; i < 3; i++) {
      let card = `
      <input type="radio" id="data-${i}" class="element"  name="element" onchange="selectElement(${data.features[i].geometry.coordinates[0]},${data.features[i].geometry.coordinates[1]})">
      <label for="data-${i}" class="card-label">   
          <div class="endereco-card">
          <div class="local-name">
              <i class="fa-solid fa-location-dot"></i>
              <h3 class="single-line-text">${data.features[i].text}</h3>
          </div>    
              <span class="single-line-text">${data.features[i].place_name}</span>
          </div>
        </label> `;
      containerDiv.insertAdjacentHTML('beforeend', card);
  }
  selectElement(data.features[0].geometry.coordinates[0],data.features[0].geometry.coordinates[1]);
  document.getElementById('data-0').checked = true;
  
}

function selectElement(long, lat){
  console.log("latitude:", lat ,"longitude:", long);
  var url = "chiposto.html?lat="+lat+"&long="+long;
  const botoesdepesquisa = document.querySelectorAll('.pesquisa');
  botoesdepesquisa.forEach(botao=> {
    botao.href = url;
    console.log("achei botão!",url);
  });
}


  function obterLocalizacao() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                var urlquery = "chiposto.html?lat="+latitude+"&long="+longitude;
                redirecionar(urlquery);
                // Aqui você pode usar a latitude e a longitude conforme necessário
            },
            function(error) {
                // Trate os erros de geolocalização
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Permissão de geolocalização negada pelo usuário. Tente novamente.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Informações de localização indisponíveis. Tente novamente.");
                        break;
                    case error.TIMEOUT:
                        alert("A solicitação de geolocalização expirou. Tente novamente.");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("Ocorreu um erro desconhecido ao obter a localização. Tente novamente.");
                        break;
                }

                // Permita que o usuário tente novamente chamando a função novamente
                
            }
        );
    } else {
        alert("Geolocalização não suportada pelo navegador.");
    }
}

// Chame a função para iniciar o processo de obtenção da localização


function redirecionar(link) {
  
  window.location.href = link;
}

 document.getElementById('botao-adm').addEventListener('click', function() {
      // Solicitar código de administrador via prompt
      var codigoAdm = prompt('Digite o código de administrador:');

      // Verificar se o código está correto
      if (codigoAdm === 'chiposto') {
        // Redirecionar para a página adm.html
        window.location.href = 'adm.html';
      } else {
        // Exibir alerta de código incorreto
        alert('Código de administrador incorreto. Tente novamente.');
      }
    });

    document.getElementById("localizacao-atual").addEventListener("click", obterLocalizacao);
    function obterLocalizacao() {
      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
              function(position) {
                  var latitude = position.coords.latitude;
                  var longitude = position.coords.longitude;
                  var urlquery = "chiposto.html?lat="+latitude+"&long="+longitude;
                  redirecionar(urlquery);
                  // Aqui você pode usar a latitude e a longitude conforme necessário
              },
              function(error) {
                  // Trate os erros de geolocalização
                  switch(error.code) {
                      case error.PERMISSION_DENIED:
                          alert("Permissão de geolocalização negada pelo usuário. Tente novamente.");
                          break;
                      case error.POSITION_UNAVAILABLE:
                          alert("Informações de localização indisponíveis. Tente novamente.");
                          break;
                      case error.TIMEOUT:
                          alert("A solicitação de geolocalização expirou. Tente novamente.");
                          break;
                      case error.UNKNOWN_ERROR:
                          alert("Ocorreu um erro desconhecido ao obter a localização. Tente novamente.");
                          break;
                  }
                  // Permita que o usuário tente novamente chamando a função novamente
                  
              }
          );
      } else {
          alert("Geolocalização não suportada pelo navegador.");
      }
  }
  // Chame a função para iniciar o processo de obtenção da localização
  function redirecionar(link) {
    
    window.location.href = link;
  }