
window.onload = iniciar;
const ordenar = document.getElementById('btnDistancia');
ordenar.checked = true;
/* Nome da função: exibirIconesCaracteristicas
   Entrada: posto (objeto do posto)
   Saída: iconContainer (elemento HTML contendo ícones)
   Descrição: Cria um contêiner de ícones com base nas características do posto.
   Dependências: N/A
*/
function exibirIconesCaracteristicas(posto) {
    const iconContainer = document.createElement('div');

    // Tabela de mapeamento entre características e ícones
    const caracteristicasIcones = {
        "restaurante": "fas fa-utensils",
        "lava-rápido": "fas fa-broom",
        "oficina": "fas fa-tools",
        "24 horas": "fas fa-clock"
        // Adicione mais características conforme necessário
    };
    console.log(caracteristicasIcones);
    // Mapeia as características e cria um ícone para cada uma
    posto.features.forEach(caracteristica => {
        console.log(caracteristica);
        const icon = document.createElement('i');
        const iconClass = caracteristicasIcones[caracteristica];
       
        if (iconClass) {
            icon.className = iconClass;
            // Adiciona o ícone ao contêiner
            iconContainer.appendChild(icon);
            
        }
    });
    console.log(iconContainer);
    return iconContainer;
}

/* Nome da função: calcularDistancia
   Entrada: lat1, lon1, lat2, lon2 (coordenadas dos pontos)
   Saída: distancia (distância entre os pontos em quilômetros)
   Descrição: Calcula a distância entre dois pontos usando a fórmula de Haversine.
   Dependências: paraRadianos
*/
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const raioTerra = 6371; // Raio médio da Terra em quilômetros

    // Converte graus para radianos
    function paraRadianos(valor) {
        return (Math.PI / 180) * valor;
    }

    // Diferença entre as coordenadas
    const deltaLat = paraRadianos(lat2 - lat1);
    const deltaLon = paraRadianos(lon2 - lon1);

    // Fórmula de Haversine
    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(paraRadianos(lat1)) * Math.cos(paraRadianos(lat2)) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distância em quilômetros
    const distancia = raioTerra * c;

    return distancia;
}

/* Nome da função: verificarDistancia
   Entrada: coordenadas1, coordenadas2, distanciaMaxima (coordenadas dos pontos e distância máxima permitida)
   Saída: true se a distância está dentro do limite, false caso contrário
   Descrição: Verifica se a distância entre duas coordenadas está dentro do limite especificado.
   Dependências: calcularDistancia
*/
function verificarDistancia(coordenadas1, coordenadas2, distanciaMaxima) {


    const lat1 = coordenadas1[0];
    const lon1 = coordenadas1[1];
    const lat2 = coordenadas2[0];
    const lon2 = coordenadas2[1];
 
    const distancia = calcularDistancia(lat1, lon1, lat2, lon2);

    console.log(`Distância entre (${lat1}, ${lon1}) e (${lat2}, ${lon2}): ${distancia} km`);

    return distancia <= distanciaMaxima;
}

/* Nome da função: iniciar
   Entrada: N/A
   Saída: N/A
   Descrição: Função de inicialização do programa. Define o estado inicial e carrega os postos.
   Dependências: obterLocalizacaoPesquisada, ObterPostos, AtualizarPostos, Exibirpostos, filtrarpordistancia, filtrarporcaracteristicas, ordenarpordistancia, ordenarporpreco
*/
async function iniciar() {
    
    const postos = await ObterPostos();
    AtualizarPostos(postos);
    console.log("iniciei :)");
}

/* Nome da função: obterLocalizacaoPesquisada
   Entrada: N/A
   Saída: coordinates (array de latitude e longitude)
   Descrição: Obtém valores da query string para utilizar posteriormente e retorna um array de coordenadas.
   Dependências: N/A
*/
 function obterLocalizacaoPesquisada() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Obtém os valores dos parâmetros "lat" e "long" da query string
    const latitude = parseFloat(urlParams.get('lat'));
    const longitude = parseFloat(urlParams.get('long'));
    const coordinates = [latitude, longitude];
    console.log(coordinates);
    return coordinates;
}
let localizacaopq =  obterLocalizacaoPesquisada();
console.log(localizacaopq);
/* Nome da função: ObterPostos
   Entrada: N/A
   Saída: data (dados dos postos)
   Descrição: Obtém os dados dos postos a partir de uma fonte externa (JSON).
   Dependências: N/A
*/
async function ObterPostos() {
    const response = await fetch(`https://jsonserver-tiaw-postos.gabrielarth30.repl.co/gasStations`);
    const data = await response.json();
    
    return data;
}

/* Nome da função: AtualizarPostos
   Entrada: postos (dados dos postos)
   Saída: N/A
   Descrição: Atualiza a exibição dos postos com base nos filtros e opção de ordenação.
   Dependências: filtrarpordistancia, filtrarporcaracteristicas, ordenarpordistancia, ordenarporpreco, Exibirpostos
*/
function AtualizarPostos(postos) {
   
    console.clear();
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    console.log(postos);
    postos = filtrarPorDistancia(postos);
    
    postos = filtrarPorCaracteristicas(postos);
   
    const ordenar = document.getElementById('btnDistancia');
    if (ordenar.checked) {
        postos = ordenarPorDistancia(postos);
        console.log(postos);
    } 
    else {
        postos = ordenarPorPreco(postos);
        console.log(postos);
    }
    
    exibirPostos(postos);
    addRatingEventListener();
    limparMarcadores();
   
    const map = get_map();
get_locations(map, postos);
    
}

/* Nome da função: filtrarPorDistancia
   Entrada: postos (dados dos postos)
   Saída: postos filtrados pela distância máxima
   Descrição: Filtra os postos com base na distância máxima especificada.
   Dependências: obterLocalizacaoPesquisada, verificarDistancia
*/
function filtrarPorDistancia(postos) {
 // Obtém a localização pesquisada


 // Obtém a distância máxima do elemento distanceRange
 const distanceRange = document.getElementById('distanceRange');
 const distanceValueSpan = document.getElementById('distanceValue');

 // Obtém o valor atual do input range
 const distanciaMaxima = parseFloat(distanceRange.value);

 // Atualiza o texto exibido para refletir o novo valor
 distanceValueSpan.innerText = `${distanciaMaxima} km`;
 // Verifica se a distância máxima é um número válido
 if (isNaN(distanciaMaxima)) {
     console.error('Distância máxima inválida:', distanceRange.value);
     // Retorna a lista original se a distância máxima não for um número válido
 }

 // Filtra os postos com base na distância máxima
 const postosFiltrados = postos.filter((posto) => {
     // Verifica se o posto está dentro da distância máxima

    
     const estaDentroDaDistancia = verificarDistancia(localizacaopq, posto.coordinates, distanciaMaxima);
     console.log(`Posto ${posto.id}: ${estaDentroDaDistancia ? 'Dentro' : 'Fora'} da distância máxima`);
     console.log('estaDentroDaDistancia:', estaDentroDaDistancia);
     return estaDentroDaDistancia;
 });

 console.log('Postos após filtrar por distância:', postosFiltrados);
 return postosFiltrados;
}

/* Nome da função: filtrarPorCaracteristicas
   Entrada: postos (dados dos postos)
   Saída: postos filtrados pelas características selecionadas
   Descrição: Filtra os postos com base nas características selecionadas.
   Dependências: N/A
*/
function filtrarPorCaracteristicas(postos) {
    const lavarapido = document.getElementById('chkLavaRapido');
    const restaurante = document.getElementById('chkRestaurante');
    const oficina = document.getElementById('chkOficina');
    const loja = document.getElementById('chkLoja');
    const horas = document.getElementById('chk24h');
    let caracteristicasSelecionadas = [];

    if (lavarapido.checked) {
        caracteristicasSelecionadas.push('lava-rápido');
    }
    if (restaurante.checked) {
        caracteristicasSelecionadas.push('restaurante');
    }
    if (oficina.checked) {
        caracteristicasSelecionadas.push('oficina');
    }
    if (horas.checked) {
        caracteristicasSelecionadas.push('24 horas');
    }

    // Filtrar os postos com base nas características selecionadas
    postos = postos.filter(posto => {
        return caracteristicasSelecionadas.every(caracteristica => posto.features.includes(caracteristica));
    });
    console.log(postos);
    return postos;
}

/* Nome da função: ordenarPorDistancia
   Entrada: postos (dados dos postos)
   Saída: postos ordenados por distância
   Descrição: Ordena os postos com base na distância até a localização pesquisada.
   Dependências: calcularDistancia, obterLocalizacaoPesquisada
*/
function ordenarPorDistancia(postos) {
   

    postos.sort((a, b) => {

        const distanciaA = calcularDistancia(localizacaopq[0], localizacaopq[1], a.coordinates[0], a.coordinates[1]);
        const distanciaB = calcularDistancia(localizacaopq[0], localizacaopq[1],  b.coordinates[0], b.coordinates[1]);

        return distanciaA - distanciaB;
    });
    console.log(postos);
    return postos;
    
}

/* Nome da função: ordenarPorPreco
   Entrada: postos (dados dos postos)
   Saída: postos ordenados por preço
   Descrição: Ordena os postos com base no preço do combustível.
   Dependências: N/A
*/
function ordenarPorPreco(postos) {
    postos.sort((a, b) => a.gas_Price - b.gas_Price);
    console.log(postos);
    return postos;
}

/* Nome da função: exibirPostos
   Entrada: postos (dados dos postos)
   Saída: N/A
   Descrição: Exibe os postos na página, incluindo informações como distância, ícones e preço.
   Dependências: calcularDistancia, obterLocalizacaoPesquisada, exibirIconesCaracteristicas
*/
function exibirPostos(postos) {
    
    const cardContainer = document.getElementById('card-container');
    
    if(postos.length != 0){
    for (let i = 0; i < postos.length; i++) {
        const cardDiv = document.createElement('div');
        cardDiv.className = "card mb-3";
        const distanciacaulc = calcularDistancia(localizacaopq[0], localizacaopq[1], postos[i].coordinates[0], postos[i].coordinates[1]);
        const distancia = distanciacaulc.toFixed(2);
        console.log(distancia);
       
        cardDiv.innerHTML = `
            <div class="card-content">
                <div class="card-imagem">
                    <img id="card-imagem" src="${postos[i].photo_Url}">
                </div>
                <div class="conteudo-card">
                    <div class="card-title">${postos[i].name}</div>
                    <div class="card-distance">${distancia} - KM</div>
                    <a class="btn-modal" target="_blank" href="https://maps.google.com/maps?q=${postos[i].coordinates[0]},${postos[i].coordinates[1]}">Ir</a>
                    <div class="icon-container">
                        <span class="icon" id="icons-postos-${postos[i].id}"></span>
                    </div>
                    <div class="card-description"><i class="fa-solid fa-location-dot"></i>${postos[i].location}</div>
                    <div class="avaliacao" id="avaliacoes-${postos[i].id}"></div>
                    <button class="coment-toggler"><span class="open">Ver mais comentarios</span>
                    <div class=""slv-dth>
                    <button class="button-salve" onclick="toggleBookmark(this,${postos[i].id})" data-posto="${postos[i].id}"><i class="fa-regular fa-bookmark "></i></button>
                    </div>
                    
                </div>

                <div class="button-container">
                    <p class="button">R$ ${postos[i].gas_Price}</p>
                </div>
                <div class="comentarios">
                    <div class="leftcomentsection">
                    <div class="card-envio">
                    <h3 class="username">Nome do Usuário</h3>
                    <form  data-ratting="1" id="${postos[i].id}">
                        <textarea id="new-comment-${postos[i].id}" class="comenttext" rows="4" placeholder="Digite seu comentário aqui"></textarea>
                        <input type="hidden" id="rating" name="rating" value="0">
                        <div class="rating-section">
                            <p>Avaliação:</p>
                            <div class="stars" id="ratingStars">
                                <img class="star" src="https://static.vecteezy.com/system/resources/previews/001/189/063/original/star-rounded-png.png" alt="Estrela Vazia" data-value="1" data-posto="${postos[i].id}">
                                <img class="star" src="https://static.vecteezy.com/system/resources/previews/001/189/063/original/star-rounded-png.png" alt="Estrela Vazia" data-value="2" data-posto="${postos[i].id}">
                                <img class="star" src="https://static.vecteezy.com/system/resources/previews/001/189/063/original/star-rounded-png.png" alt="Estrela Vazia" data-value="3" data-posto="${postos[i].id}">
                                <img class="star" src="https://static.vecteezy.com/system/resources/previews/001/189/063/original/star-rounded-png.png" alt="Estrela Vazia" data-value="4" data-posto="${postos[i].id}">
                                <img class="star" src="https://static.vecteezy.com/system/resources/previews/001/189/063/original/star-rounded-png.png" alt="Estrela Vazia" data-value="5" data-posto="${postos[i].id}">
                            </div>
                        </div>
                        <div class="card-envio">
                        <button class="submitbutton save" id="botão-posto-${postos[i].id}"  onclick="criarcomentario(${postos[i].id}), naoreiniciar(event)">Enviar</button>
                        </div>
                    </form>
                    <span>Comentarios anteriores:</span>
                    </div>
                    <div class="preview-coments" id="preview.coments-${postos[i].id}"></dv>
                </div>
                    </div>
            </div>
        `;
    
        cardContainer.appendChild(cardDiv);
        console.log(cardDiv);
        const icons = document.getElementById(`icons-postos-${postos[i].id}`);
        console.log(icons);
        const iconContainer = exibirIconesCaracteristicas(postos[i]);
        
        icons.appendChild(iconContainer);
        const ratting = calcularMediaAvaliacoes(postos[i], postos[i].id);
        const exibir = exibirComentarios(postos[i], postos[i].id);
        console.log(cardContainer);
    }
}
else{
    const cardDiv = document.createElement('div');
    cardDiv.className = "postos-notfound";
    cardDiv.innerHTML = '<span>Nenhum posto encontrado :( ! Tente atualizar as preferencias.</span>'
    cardContainer.appendChild(cardDiv);
    console.log(cardContainer);
}
}


// Reinicia o Range




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

   





/*Função de comentario*/

function setRating(value, starsContainer) {
    const stars = starsContainer.querySelectorAll(".star");

    stars.forEach((star, index) => {
      star.src = index < value
        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Yellow_Star_with_rounded_edges.svg/1075px-Yellow_Star_with_rounded_edges.svg.png"
        : "https://static.vecteezy.com/system/resources/previews/001/189/063/original/star-rounded-png.png";
    });
  }

let currentRating = 1;

  

function addRatingEventListener() {
    const starsContainers = document.querySelectorAll(".stars");

    starsContainers.forEach(starsContainer => {
        const stars = starsContainer.querySelectorAll(".star");

        stars.forEach((star) => {
            star.addEventListener("click", function () {
                const ratingValue = parseInt(star.getAttribute("data-value"));
                const postocorrespondente = star.getAttribute("data-posto");
                const formulario = document.getElementById(postocorrespondente); // Correção aqui
                formulario.setAttribute('data-ratting', ratingValue);
                setRating(ratingValue, starsContainer);

                currentRating = ratingValue;
            });
        });
    });
}


  function calcularMediaAvaliacoes(posto, i) {
    const comentarios = posto.comments;
    const totalAvaliacoes = comentarios.reduce((total, comentario) => total + comentario.rating, 0);
    const mediaAvaliacoes = totalAvaliacoes / comentarios.length || 0;
    const seletor = 'avaliacoes-'+ i;
    const divAvaliacoes = document.getElementById(seletor);
    divAvaliacoes.innerHTML = `
      <p>Total do posto: ${getStarImages(Math.round(mediaAvaliacoes))} (${mediaAvaliacoes.toFixed(0)})</p>
    `;
  }
  function getStarImages(rating) {
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      const starImage = i <= rating
        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Yellow_Star_with_rounded_edges.svg/1075px-Yellow_Star_with_rounded_edges.svg.png"
        : "https://static.vecteezy.com/system/resources/previews/001/189/063/original/star-rounded-png.png";

      starsHTML += `<img src="${starImage}" alt="Estrela" class="star-registred" data-value="${i}">`;
    }
    return starsHTML;
  }

  function exibirComentarios(posto,i) {
    const comentarios = posto.comments;
    const seletor = 'preview.coments-'+ i;
    const previewComents = document.getElementById(seletor);

    previewComents.innerHTML = "";

    for (const comentario of comentarios) {
      const novoComentarioDiv = document.createElement("div");
      novoComentarioDiv.classList.add("preview", "coment");

      novoComentarioDiv.innerHTML = `
     
        <div class="leftcomentsection">
        <div class="card-coment">
          <h3 class="username">${comentario.user_Name}</h3>
          <p>${comentario.comment_Content}</p>
          <div class="rating-section">
          
          <div class="stars" data-rating="${comentario.rating}">
            ${getStarImages(comentario.rating)}
            <span>(${comentario.rating})</span>
            </div>
          </div>
          
        </div>
        </div>
       
      `;

      previewComents.appendChild(novoComentarioDiv);
    }
  }

  function naoreiniciar(event){
    event.preventDefault();
  }
  function criarcomentario(iddoposto) {
    // URL completa do recurso específico ao qual você deseja adicionar um comentário
    const urlRecurso = `https://jsonserver-tiaw-postos.gabrielarth30.repl.co/gasStations/${iddoposto}`;

    // Obtém os dados atuais do recurso
    fetch(urlRecurso)
        .then((response) => response.json())
        .then((recurso) => {
            // Substitua "NOVO_COMENTARIO" pelos dados reais do novo comentário
            const formulario = document.getElementById(iddoposto);
            const inputid = 'new-comment-' + iddoposto;
            const input = document.getElementById(inputid);
            const rating = parseInt(formulario.dataset.ratting);

            // Verifica se o valor do comentário foi fornecido
            if (!input.value.trim()) {
                alert("Por favor, forneça um comentário antes de adicionar.");
                return; // Sai da função se o valor do comentário não foi fornecido
            }

            const novoComentario = {
                rating: rating,
                comment_Content: input.value,
                user_Name: "exemplo",
            };

            // Adiciona o novo comentário à lista existente
            recurso.comments.push(novoComentario);

            // Envia os dados atualizados de volta para o servidor
            const options = {
                method: "PATCH", // Ou "PUT" dependendo dos requisitos do seu servidor
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recurso),
            };

            return fetch(urlRecurso, options);
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Comentário adicionado com sucesso:", data);
            iniciar();
        })
        .catch((error) => {
            console.error("Erro ao adicionar comentário:", error);
        });
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

// Função para atualizar o usuário na API JsonServer
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

function get_map() {
    const centralLatLong = [-43.979752212287885, -19.950002788914464];

    mapboxgl.accessToken = 'pk.eyJ1Ijoiam90YWdhYmJzIiwiYSI6ImNscGtqYnI3MTA5eXgyam56czFyMDYzZnEifQ.G73CHy1uYDsimCIFwMrRxg';

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: centralLatLong,
        zoom: 11,
    });
    return map;
}

function get_card_marker(album) {
    console.log(album);
    return `
    <a class="text-decoration-none text-reset" href="details.html?id=${album.id}" target="_blank">
        <img src="${album.photo_Url}" class="card-img-top car-img" alt="${album.name}"></img>
        <div class="card-body p-2 ">
            <h5 class="card-title text-truncate">${album.name}</h5>
            <p class="card-text">${album.location}</p>
            <p class="card-text">Long: ${album.coordinates[0]}</p>
            <p class="card-text">Lat: ${album.coordinates[1]}</p>
        </div>
    </a> `;
}

function get_locations(map, postos) {
   
            postos.forEach((item) => {
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    get_card_marker(item)
                );
                const coordenadas = [item.coordinates[1],item.coordinates[0]];
                    
                const marker = new mapboxgl.Marker({ color: "orange" })
                    
                    .setLngLat(coordenadas)
                    .setPopup(popup)
                    .addTo(map);
       
});
}
function limparMarcadores() {
    // Obtém todos os marcadores no mapa
    var allMarkers = document.querySelectorAll('.mapboxgl-marker');
  
    // Remove cada marcador do DOM
    allMarkers.forEach(function(marker) {
      marker.remove();
    });
  }
  
// Exibir modal de boas-vindas se não estiver presente no localStorage
if (!localStorage.getItem('welcomeShown')) {
    $('#welcomeModal').modal('show');
    localStorage.setItem('welcomeShown', 'true');
  }

  // Adicionar notificação de boas-vindas fixa
  const welcomeNotification = {
    message: 'Bem-vindo ao nosso site! Esperamos que você tenha uma excelente experiência.',
    type: 'info',
    timestamp: new Date().getTime()
  };
  localStorage.setItem('notification_welcome', JSON.stringify(welcomeNotification));

  // Função para exibir notificações
  function showNotifications() {
    const notificationModal = $('#notificationModal');
    const notificationBody = $('#notificationBody');
    const notificationCountBadge = $('#notification-count-badge');

    // Limpar notificações antigas
    notificationBody.empty();

    // Obter notificações do localStorage
    let notificationCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('notification_')) {
        const notificationData = JSON.parse(localStorage.getItem(key));
        const notificationMessage = notificationData.message;
        const notificationType = notificationData.type || 'info'; // Padrão é 'info'
        const notificationItem = `
          <div class="card notification-card">
            <div class="card-body">
              <h5 class="card-title">${getNotificationTypeDescription(notificationType)}</h5>
              <p class="card-text">${notificationMessage}</p>
              <button class="btn btn-danger" onclick="deleteNotification('${key}')">Excluir</button>
            </div>
          </div>
        `;
        notificationBody.append(notificationItem);
        notificationCount++;
      }
    }

    // Exibir modal de notificações
    notificationCountBadge.text(notificationCount);
    $('#notification-count-badge').text(notificationCount);
    notificationModal.modal('show');
  }

  // Função para mostrar a última notificação no balão
  function showLatestNotification() {
    showNotifications();
    showBalloonNotification();
  }

  // Função para exibir notificação fora do modal
  function showBalloonNotification() {
    const notificationCountBadge = $('#notification-count-badge');
    const notificationCard = $('#notification-card');

    // Obter notificações do localStorage
    let notificationCount = parseInt(notificationCountBadge.text()) || 0;

    // Se houver notificações, exibir a última no balão
    if (notificationCount > 0) {
      const latestNotificationKey = `notification_${notificationCount - 1}`;
      const latestNotificationData = JSON.parse(localStorage.getItem(latestNotificationKey));

      const notificationBalloon = $('#notification-balloon');
      const notificationTitle = $('#notification-title');
      const notificationDescription = $('#notification-description');

      notificationTitle.text(getNotificationTypeDescription(latestNotificationData.type));
      notificationDescription.text(latestNotificationData.message);
      notificationBalloon.show();
    } else {
      // Se não houver notificações, ocultar o balão
      $('#notification-balloon').hide();
    }
  }

  // Função para abrir modal de nova notificação
  function openNewNotificationModal() {
    const adminCode = prompt('Digite o código de verificação do administrador:');
    if (adminCode === 'chiposto') {
      $('#newNotificationModal').modal('show');
    } else {
      alert('Código de verificação incorreto. Tente novamente.');
    }
  }

  // Função para salvar nova notificação
  function saveNewNotification() {
    const newNotificationMessage = $('#newNotificationMessage').val();
    const newNotificationType = $('#newNotificationType').val();
    
    if (newNotificationMessage.trim() !== '') {
      // Simular dados da notificação
      const notificationData = {
        message: newNotificationMessage,
        type: newNotificationType,
        timestamp: new Date().getTime()
      };

      // Salvar notificação no localStorage
      const notificationCount = parseInt(localStorage.getItem('notificationCount')) || 0;
      localStorage.setItem(`notification_${notificationCount}`, JSON.stringify(notificationData));
      
      // Incrementar contador e atualizar badge
      localStorage.setItem('notificationCount', notificationCount + 1);
      showNotifications(); // Atualizar o modal de notificações
      showBalloonNotification(); // Exibir notificação no balão
      // Fechar modal de nova notificação
      $('#newNotificationModal').modal('hide');
    } else {
      alert('Digite uma mensagem para a notificação.');
    }
  }

  // Função para excluir notificação
  function deleteNotification(key) {
    const confirmDelete = confirm('Deseja realmente excluir esta notificação?');
    if (confirmDelete) {
      localStorage.removeItem(key);
      showNotifications(); // Atualizar o modal de notificações
      showBalloonNotification(); // Exibir notificação no balão
    }
  }

  // Função para excluir todas as notificações
  function deleteAllNotifications() {
    const confirmDeleteAll = confirm('Deseja realmente excluir todas as notificações?');
    if (confirmDeleteAll) {
      // Remover todas as notificações do localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('notification_')) {
          localStorage.removeItem(key);
        }
      }

      // Resetar o contador de notificações
      localStorage.setItem('notificationCount', 0);

      showNotifications(); // Atualizar o modal de notificações
      showBalloonNotification(); // Exibir notificação no balão
    }
  }

  // Função para obter descrição do tipo de notificação
  function getNotificationTypeDescription(type) {
    switch (type) {
      case 'info':
        return 'Informação';
      case 'warning':
        return 'Aviso';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  }

  function toggleMenu() {
    var menuContent = document.querySelector('.menu-content');
    menuContent.classList.toggle('show');
  }
  
  document.getElementById("localizacao-atual").addEventListener("click", obterLocalizacao());
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
// Adicione um ouvinte de evento ao botão para chamar a função redirecionar quando clicado
