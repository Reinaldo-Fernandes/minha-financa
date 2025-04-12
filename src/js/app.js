// Calculadora
document.getElementById("form-calculadora").addEventListener("submit", function (e) {
  e.preventDefault();

  const renda = parseFloat(document.getElementById("renda").value);
  const despesas = parseFloat(document.getElementById("despesas").value);
  const meta = parseFloat(document.getElementById("meta").value);
  const gastosExtras = parseFloat(document.getElementById("gastos-extras").value);
  const resultado = document.getElementById("resultado");

  // Calcular a economia mensal (renda - despesas - gastos extras)
  const economia = renda - despesas - gastosExtras;
  const porcentagem = ((economia / renda) * 100).toFixed(2);

  // Verificar se a economia mensal é suficiente
  if (economia >= meta) {
    resultado.innerHTML = `🎉 Você pode economizar <strong>R$${economia}</strong> (${porcentagem}%) por mês!`;
  } else if (economia > 0) {
    // Calcular o tempo necessário para alcançar a meta
    const tempoParaMeta = Math.ceil(meta / economia); // arredonda para cima
    resultado.innerHTML = `
      ⚠️ Você está economizando apenas <strong>R$${economia}</strong>. 
      Você levaria <strong>${tempoParaMeta}</strong> meses para atingir sua meta de R$${meta}.
    `;
  } else {
    resultado.innerHTML = `⚠️ Não é possível economizar com esses valores. Reveja suas despesas e gastos extras.`;
  }
});

// Mostrar calculadora ao clicar no botão "Começar"
document.getElementById("btn-comecar").addEventListener("click", function (e) {
  e.preventDefault(); // Evita rolagem instantânea com o href
  document.querySelector(".calculadora").classList.remove("hidden");

  // Scroll suave até a calculadora
  document.getElementById("calculadora").scrollIntoView({ behavior: "smooth" });
});

// Dicas suaves
const dicasSuaves = [
  "🌱 Guardar um pouquinho todo mês não muda sua vida hoje, mas pode abrir caminhos que você nem imagina.",
  "🎧 Já tentou escutar um podcast sobre grana enquanto caminha ou lava a louça? Aprender pode ser leve.",
  "🧾 Saber o que você gasta é liberdade — não controle.",
  "🤝 Falar sobre dinheiro com alguém de confiança pode aliviar e abrir ideias novas.",
  "📱 Você não precisa largar o iFood — só encontrar seu próprio equilíbrio.",
  "👟 Comprar algo com dinheiro guardado dá uma sensação diferente. Tipo: 'eu cuidei de mim'.",
  "📌 Ter uma meta simples muda o jeito que você enxerga o dinheiro.",
  "💡 Às vezes o que falta não é dinheiro, é um plano.",
  "🧠 Aprender sobre grana não precisa ser chato — tem conteúdo bom em todo canto.",
  "🌟 Só de estar aqui lendo isso, você já tá fazendo mais que muita gente."
];

const dicaTexto = document.getElementById("dicaTexto");
const indicadoresContainer = document.getElementById("indicadores");
let indexAtual = 0;
let intervalo;

function criarIndicadores() {
  indicadoresContainer.innerHTML = "";
  dicasSuaves.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("indicador");
    dot.addEventListener("click", () => {
      indexAtual = i;
      trocarDica();
      reiniciarIntervalo();
    });
    indicadoresContainer.appendChild(dot);
  });
}

function atualizarIndicadores() {
  const todos = document.querySelectorAll(".indicador");
  todos.forEach((dot, i) => {
    dot.classList.toggle("ativo", i === indexAtual);
  });
}

function trocarDica() {
  dicaTexto.style.opacity = 0;
  setTimeout(() => {
    dicaTexto.textContent = dicasSuaves[indexAtual];
    dicaTexto.style.opacity = 1;
    atualizarIndicadores();
    indexAtual = (indexAtual + 1) % dicasSuaves.length;
  }, 300);
}

function iniciarIntervalo() {
  intervalo = setInterval(trocarDica, 6000);
}

function reiniciarIntervalo() {
  clearInterval(intervalo);
  iniciarIntervalo();
}

function iniciar() {
  criarIndicadores();
  trocarDica();
  iniciarIntervalo();
}

window.addEventListener("DOMContentLoaded", iniciar);
