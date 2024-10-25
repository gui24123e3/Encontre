let comercios = [];
let filteredComercios = [];
let loading = true;

const frasesLoading = [
    "Estamos buscando as melhores opções para você, por favor aguarde...",
    "Carregando os dados, isso pode levar alguns segundos...",
    "Um momento! Estamos preparando as informações para você...",
    "Estamos quase lá! Só mais um instante...",
    "Aguarde um pouco, estamos reunindo as melhores ofertas...",
    "Estamos trabalhando para trazer os melhores locais, por favor, espere...",
    "Preparando tudo para você! Isso não levará muito tempo...",
    "Carregando... Estamos em busca de novidades para você!"
];

let loadingInterval;

const carregarComercios = async () => {
    loading = true;
    const loadingMessageElement = document.getElementById('loadingMessage');

    // Mostra a mensagem de loading
    loadingMessageElement.style.display = 'block';
    let index = 0;

    // Atualiza a mensagem a cada 4 segundos
    loadingInterval = setInterval(() => {
        loadingMessageElement.innerText = frasesLoading[index];
        index = (index + 1) % frasesLoading.length; // Loop pelo array
    }, 4000);

    try {
        const response = await fetch('https://backendencontre01.azurewebsites.net/comercio');
        const data = await response.json();
        comercios = data;
        filteredComercios = data;

        const cidadesUnicas = [...new Set(data.map(comercio => comercio.cidade))];
        const estadosUnicos = [...new Set(data.map(comercio => comercio.estado))];

        setSelectOptions('estado', estadosUnicos, 'Selecione o Estado');
        setSelectOptions('cidade', cidadesUnicas, 'Selecione a Cidade');
        exibirComercios(filteredComercios);

        document.getElementById('estado').addEventListener('change', atualizarCidades);
        document.getElementById('categoria').addEventListener('change', filtrarComercios);
        document.getElementById('cidade').addEventListener('change', filtrarComercios);
    } catch (error) {
        console.error(error);
    } finally {
        loading = false;
        clearInterval(loadingInterval); // Limpa o intervalo
        loadingMessageElement.style.display = 'none'; // Esconde a mensagem de loading
    }
};


const atualizarCidades = () => {
    const selectedEstado = document.getElementById('estado').value;
    const cidadesFiltradas = [...new Set(comercios
        .filter(comercio => comercio.estado === selectedEstado)
        .map(comercio => comercio.cidade))];

    setSelectOptions('cidade', cidadesFiltradas, 'Selecione a Cidade');

    // Atualiza comercios ao mudar o estado
    filtrarComercios();
};

const setSelectOptions = (selectId, options, defaultText) => {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">${defaultText}</option>`; // Limpa opções anteriores
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
};

const filtrarComercios = () => {
    const selectedCategoria = document.getElementById('categoria').value;
    const selectedEstado = document.getElementById('estado').value;
    const selectedCidade = document.getElementById('cidade').value;

    filteredComercios = comercios.filter(comercio => {
        return (selectedCategoria ? comercio.categoria === selectedCategoria : true) &&
               (selectedEstado ? comercio.estado === selectedEstado : true) &&
               (selectedCidade ? comercio.cidade === selectedCidade : true);
    });

    exibirComercios(filteredComercios);
};

window.onload = function() {
    mostrarPopupConsentimento();
    carregarComercios();
};

const mostrarPopupConsentimento = () => {
    if (document.cookie.indexOf("cookies_accepted=true") === -1) {
        setTimeout(() => {
            document.getElementById('cookie-consent').style.display = 'flex';
        }, 1000);
    } else {
        document.getElementById('consent-message').style.display = 'block';
    }
};

const exibirComercios = (comerciosParaExibir) => {
    const container = document.getElementById('comerciosContainer');
    container.innerHTML = ''; // Limpa o container

    if (comerciosParaExibir.length === 0) {
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = 'mensagem';
        mensagemDiv.innerHTML = `<p>Em Breve Novos Lugares estarão aqui! Volte Mais Tarde.</p>`;
        container.appendChild(mensagemDiv);
    } else {
        comerciosParaExibir.forEach(comercio => {
            const comercioDiv = document.createElement('div');
            comercioDiv.className = 'comercio-item';
            comercioDiv.innerHTML = `
                <img src="${comercio.imagem_capa || 'https://via.placeholder.com/300'}" alt="${comercio.nome}" class="comercio-image" />
                <div class="comercio-header">
                    <h3>${comercio.nome}</h3>
                </div>
                <div class="redes-sociais-container">
                    <h2 class="titulo-com-icone">
                        <img src="./img/icons8-usuário-homem-com-círculo-50.png" alt="Contato" class="icon" /> Contato:
                    </h2>
                    <div class="info-container">
                        <p class="info-item">Cidade: ${comercio.cidade || 'Não disponível'}</p>
                        <p class="info-item">Estado: ${comercio.estado || 'Não disponível'}</p>
                        <p class="info-item">Telefone: ${comercio.telefone || 'Não disponível'}</p>
                        <p class="info-item">Endereço: ${comercio.horario_funcionamento_feriados || 'Não disponível'}</p>
                        <p class="info-item">endereço ${comercio.horario_funcionamento || 'Não disponível'}</p>
                    </div>
                </div>
                <div class="descricao-container">
                    <h2 class="titulo-com-icone">
                        <img src="./img/icons8-contato-comercial-50.png" alt="Sobre Nós" class="icon" /> Sobre Nós:
                    </h2>
                    <p class="description">${comercio.descricao || 'Descrição não disponível'}</p>
                </div>
                <div class="redes-sociais-container">
                    <h2 class="titulo-com-icone">
                        <img src="./img/icons8-avião-de-papel-50.png" alt="Redes Sociais" class="icon" /> Redes Sociais:
                    </h2>
                    <div class="info-container">
                        <div class="links-container">
                            <div class="icon-container">
                                <a href="${comercio.link_cardapio || '#'}" target="_blank">
                                    <img src="./img/icons8-cardápio-50.png" alt="Cardápio" class="icon" />
                                </a>
                            </div>
                            <div class="icon-container">
                                <a href="${comercio.link_facebook || '#'}" target="_blank">
                                    <img src="./img/icons8-facebook-novo-50.png" alt="Facebook" class="icon" />
                                </a>
                            </div>
                            <div class="icon-container">
                                <a href="${comercio.link_instagram || '#'}" target="_blank">
                                    <img src="./img/icons8-instagram-48.png" alt="Instagram" class="icon" />
                                </a>
                            </div>
                            <div class="icon-container">
                                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(comercio.horario_funcionamento_feriados || 'Movimento Maior não disponível')}" target="_blank">
                                    <img src="./img/icons8-google-maps-novo-48.png" alt="Movimento Maior" class="icon" />
                                </a>
                            </div>
                            <div class="icon-container">
                                <a href="${comercio.link_site_pessoal || '#'}" target="_blank">
                                    <img src="./img/icons8-internet-50.png" alt="Site Pessoal" class="icon" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(comercioDiv);
        });
    }
};
window.onload = carregarComercios;
