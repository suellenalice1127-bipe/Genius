// ----- Elementos da página -----
const botoesCores = document.querySelectorAll(".cor");
const botaoIniciar = document.getElementById("iniciar");
const elStatus = document.getElementById("status");
const elRodada = document.getElementById("rodada");
const elRecorde = document.getElementById("recorde");

// ----- Estado do jogo -----
const cores = ["verde", "vermelho", "amarelo", "azul"];
const frequencias = { verde: 330, vermelho: 392, amarelo: 262, azul: 494 }; // sons (Hz)

let sequencia = [];   // a ordem que o jogo sorteou
let respostas = [];   // os cliques do jogador na rodada atual
let recorde = 0;

// ----- Utilidades -----
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let audioCtx = null;
function tocarSom(cor) {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const ganho = audioCtx.createGain();
  osc.frequency.value = frequencias[cor];
  ganho.gain.value = 0.15;
  osc.connect(ganho);
  ganho.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

function habilitarBotoes(habilitar) {
  botoesCores.forEach((botao) => (botao.disabled = !habilitar));
}

// Acende uma cor por um instante
async function piscar(cor, duracao = 400) {
  const botao = document.querySelector(`.cor.${cor}`);
  botao.classList.add("ativo");
  tocarSom(cor);
  await esperar(duracao);
  botao.classList.remove("ativo");
}

// ----- Fluxo do jogo -----
function iniciarJogo() {
  sequencia = [];
  botaoIniciar.disabled = true;
  proximaRodada();
}

async function proximaRodada() {
  respostas = [];
  habilitarBotoes(false);

  // Adiciona uma cor aleatória à sequência
  const sorteada = cores[Math.floor(Math.random() * cores.length)];
  sequencia.push(sorteada);
  elRodada.textContent = sequencia.length;

  elStatus.textContent = "Observe a sequência...";
  await esperar(800);

  // Toca a sequência inteira
  for (const cor of sequencia) {
    await piscar(cor);
    await esperar(200);
  }

  elStatus.textContent = "Sua vez!";
  habilitarBotoes(true);
}

async function aoClicar(cor) {
  respostas.push(cor);
  piscar(cor, 250);

  const posicao = respostas.length - 1;

  // Errou: compara o clique com a posição correspondente da sequência
  if (respostas[posicao] !== sequencia[posicao]) {
    fimDeJogo();
    return;
  }

  // Acertou a sequência toda: próxima rodada
  if (respostas.length === sequencia.length) {
    habilitarBotoes(false);
    elStatus.textContent = "Muito bem!";
    await esperar(900);
    proximaRodada();
  }
}

function fimDeJogo() {
  habilitarBotoes(false);

  const pontos = sequencia.length - 1; // rodadas completadas
  if (pontos > recorde) {
    recorde = pontos;
    elRecorde.textContent = recorde;
  }

  elStatus.textContent = `Errou! Você completou ${pontos} rodada(s).`;
  botaoIniciar.textContent = "Jogar de novo";
  botaoIniciar.disabled = false;
}

// ----- Eventos -----
botaoIniciar.addEventListener("click", iniciarJogo);

botoesCores.forEach((botao) => {
  botao.addEventListener("click", () => aoClicar(botao.dataset.cor));
});