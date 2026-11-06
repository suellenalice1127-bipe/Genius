// ----- Configurações (salvas no navegador) -----
const CHAVE_CONFIG = "genius-config";
const CONFIG_PADRAO = { som: true, velocidade: "normal" };

function carregarConfig() {
  try {
    return { ...CONFIG_PADRAO, ...JSON.parse(localStorage.getItem(CHAVE_CONFIG)) };
  } catch {
    return { ...CONFIG_PADRAO };
  }
}

function salvarConfig(config) {
  try {
    localStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
  } catch {
    // Se o navegador bloquear o armazenamento, o jogo usa os valores padrão
  }
}

const config = carregarConfig();
const campoSom = document.getElementById("cfg-som");
const campoVelocidade = document.getElementById("cfg-velocidade");

// Mostra os valores salvos nos campos
campoSom.checked = config.som;
campoVelocidade.value = config.velocidade;

campoSom.addEventListener("change", () => {
  config.som = campoSom.checked;
  salvarConfig(config);
});

campoVelocidade.addEventListener("change", () => {
  config.velocidade = campoVelocidade.value;
  salvarConfig(config);
});

// ----- Navegação entre as telas do menu -----
const menuPrincipal = document.getElementById("menu-principal");
const paineis = document.querySelectorAll(".painel");

function mostrarMenu() {
  paineis.forEach((painel) => (painel.hidden = true));
  menuPrincipal.hidden = false;
}

function abrirPainel(id) {
  menuPrincipal.hidden = true;
  paineis.forEach((painel) => (painel.hidden = painel.id !== id));
}

document.querySelectorAll("[data-abrir]").forEach((botao) => {
  botao.addEventListener("click", () => abrirPainel(botao.dataset.abrir));
});

document.querySelectorAll("[data-voltar]").forEach((botao) => {
  botao.addEventListener("click", mostrarMenu);
});