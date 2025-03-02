document.addEventListener("DOMContentLoaded", async () => {
  const comercioList = document.getElementById("comercio-list");
  const filterButton = document.getElementById("filter-comercio");
  const filterSelect = document.getElementById("comercio-type");
  const searchInput = document.getElementById("searchInput");

  // Armazena todos os comércios carregados
  let allComercios = [];

  // Função que carrega os comércios da API (com filtro opcional por categoria)
  async function carregarComercios(categoria = "todos") {
    try {
      let url = "https://encontreoficialback.azurewebsites.net/comercios";
      if (categoria !== "todos") {
        url += `?categoria=${categoria}`;
      }

      const response = await fetch(url);
      const comercios = await response.json();

      // Armazena os dados para a busca global
      allComercios = comercios;
      renderComercios(comercios);
    } catch (error) {
      console.error("Erro ao carregar comércios:", error);
      comercioList.innerHTML = "<p>Erro ao carregar comércios.</p>";
    }
  }

  // Função que renderiza os comércios na tela
  function renderComercios(comercios) {
    comercioList.innerHTML = "";
    if (comercios.length === 0) {
      comercioList.innerHTML = "<p>Nenhum comércio encontrado.</p>";
      return;
    }

    comercios.forEach((comercio, index) => {
      const comercioItem = document.createElement("div");
      comercioItem.classList.add("comercio-card");

      // Coleta as imagens disponíveis
      let imagens = [];
      if (comercio.imagem_capa) imagens.push(comercio.imagem_capa);
      if (comercio.imagem_capa_2) imagens.push(comercio.imagem_capa_2);
      if (comercio.imagem_capa_3) imagens.push(comercio.imagem_capa_3);

      // Cria o HTML para as imagens
      let imagensHtml = imagens
        .map(
          (img, i) =>
            `<img src="${img}" class="comercio-imagem ${
              i === 0 ? "active" : ""
            }" data-index="${i}" />`
        )
        .join("");

      // Adiciona controles se houver mais de uma imagem
      let controlsHtml =
        imagens.length > 1
          ? `
              <button class="prev">&#10094;</button>
              <button class="next">&#10095;</button>
            `
          : "";

      // Cria os botões sociais se os links estiverem disponíveis
      let socialLinksHtml = `
            <div class="comercio-links">
              ${
                comercio.link_facebook
                  ? `<a href="${comercio.link_facebook}" target="_blank" class="btn-social">Facebook</a>`
                  : ""
              }
              ${
                comercio.link_instagram
                  ? `<a href="${comercio.link_instagram}" target="_blank" class="btn-social">Instagram</a>`
                  : ""
              }
              ${
                comercio.link_site_pessoal
                  ? `<a href="${comercio.link_site_pessoal}" target="_blank" class="btn-social">Site</a>`
                  : ""
              }
            </div>
          `;

      comercioItem.innerHTML = `
            <div class="carrossel" id="carrossel-${index}">
              ${imagensHtml}
              ${controlsHtml}
            </div>
            <h3>${comercio.nome}</h3>
            <p><strong>Categoria:</strong> ${comercio.categoria}</p>
            <p><strong>Endereço:</strong> ${comercio.endereco}</p>
            <p><strong>Horário:</strong> ${
              comercio.horario_funcionamento || "Não informado"
            }</p>
            <p>${comercio.descricao || ""}</p>
            ${socialLinksHtml}
            
          `;

      comercioList.appendChild(comercioItem);

      // Adiciona os event listeners dos botões do carrossel (se houver)
      if (imagens.length > 1) {
        const carrossel = comercioItem.querySelector(".carrossel");
        const prevButton = carrossel.querySelector(".prev");
        const nextButton = carrossel.querySelector(".next");

        prevButton.addEventListener("click", () => mudarImagem(carrossel, -1));
        nextButton.addEventListener("click", () => mudarImagem(carrossel, 1));

        iniciarCarrossel(carrossel);
      }
    });
  }

  // Função para alterar a imagem do carrossel
  function mudarImagem(carrossel, direction) {
    const imagens = carrossel.querySelectorAll(".comercio-imagem");
    let activeIndex = Array.from(imagens).findIndex((img) =>
      img.classList.contains("active")
    );
    imagens[activeIndex].classList.remove("active");

    let newIndex = (activeIndex + direction + imagens.length) % imagens.length;
    imagens[newIndex].classList.add("active");
  }

  function iniciarCarrossel(carrossel) {
    setInterval(() => mudarImagem(carrossel, 1), 3000);
  }

  // Função de busca que filtra por nome, categoria, endereço e descrição
  window.performSearch = function () {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      renderComercios(allComercios);
      return;
    }
    const filtered = allComercios.filter(
      (comercio) =>
        (comercio.nome && comercio.nome.toLowerCase().includes(query)) ||
        (comercio.categoria &&
          comercio.categoria.toLowerCase().includes(query)) ||
        (comercio.endereco &&
          comercio.endereco.toLowerCase().includes(query)) ||
        (comercio.descricao && comercio.descricao.toLowerCase().includes(query))
    );
    renderComercios(filtered);
  };

  // Evento para clicar nas categorias e filtrar os comércios
  document.querySelectorAll(".category").forEach((category) => {
    category.addEventListener("click", () => {
      const categoriaSelecionada = category.getAttribute("data-category");
      carregarComercios(categoriaSelecionada);
    });
  });

  // Carrega os comércios ao iniciar a página
  carregarComercios();
});

function toggleMenu() {
  document.getElementById("nav").classList.toggle("show");
}
let currentIndex = 0;

function moveSlide(direction) {
  const slides = document.querySelectorAll(".carousel-slide");
  const totalSlides = slides.length;
  currentIndex += direction;

  if (currentIndex >= totalSlides) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = totalSlides - 1;
  }

  document.querySelector(".carousel-container").style.transform = `translateX(${
    -currentIndex * 100
  }%)`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Verifica se o cookie já foi aceito
  if (getCookie("privacyAccepted") === "true") {
    document.getElementById("privacyPopup").style.display = "none";
  } else {
    document.getElementById("privacyPopup").style.display = "block"; // Exibe o pop-up
  }
});

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

function acceptPrivacy() {
  const checkbox = document.getElementById("privacyCheckbox");
  if (!checkbox.checked) {
    alert("Por favor, marque a caixa para aceitar a política de privacidade.");
    return;
  }

  setCookie("privacyAccepted", "true", 30);

  document.getElementById("privacyPopup").style.display = "none";
}

function startVoiceSearch() {
  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "pt-BR";
    recognition.start();

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById("searchInput").value = transcript;
      performSearch(); // Dispara a busca automática
    };

    recognition.onerror = function (event) {
      alert("Erro ao capturar voz. Tente novamente!");
    };
  } else {
    alert("Seu navegador não suporta pesquisa por voz.");
  }
}
