// Função para efeito de digitação
function digitarTexto(elemento, texto, delay = 25) {
  elemento.textContent = "";
  let i = 0;

  const intervalo = setInterval(() => {
    elemento.textContent += texto.charAt(i);
    i++;
    if (i > texto.length) {
      clearInterval(intervalo);
    }
  }, delay);
}

// Mostrar calculadora ao clicar no botão "Começar"
document.getElementById("btn-comecar").addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".calculadora").classList.remove("hidden");
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

function iniciarDicas() {
  criarIndicadores();
  trocarDica();
  iniciarIntervalo();
}

// Atualizar gráfico
let grafico;

function atualizarGrafico(renda, despesas, extras, economia) {
  const ctx = document.getElementById('graficoEconomia').getContext('2d');

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Despesas', 'Gastos Extras', 'Economia'],
      datasets: [{
        label: 'Distribuição financeira',
        data: [despesas, extras, economia],
        backgroundColor: ['#ff6b6b', '#feca57', '#1dd1a1'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Atualizar metas
function atualizarMetas(economia) {
  const metas = [
    { id: "meta1", valor: 100 },
    { id: "meta2", valor: 50 },
    { id: "meta3", valor: 80 }
  ];

  metas.forEach(meta => {
    const progressoElemento = document.getElementById(`${meta.id}-progresso`);
    const progressoPercentual = Math.min((economia / meta.valor) * 100, 100).toFixed(0);

    progressoElemento.textContent = `Atingido ${progressoPercentual}%`;

    if (progressoPercentual === "100") {
      progressoElemento.classList.add("verde");
      progressoElemento.classList.remove("amarelo", "vermelho");
    } else if (progressoPercentual > 0) {
      progressoElemento.classList.add("amarelo");
      progressoElemento.classList.remove("verde", "vermelho");
    } else {
      progressoElemento.classList.add("vermelho");
      progressoElemento.classList.remove("verde", "amarelo");
    }
  });
}

// Calculadora - única função de submit
document.getElementById("form-calculadora").addEventListener("submit", function (e) {
  e.preventDefault();

  const renda = parseFloat(document.getElementById("renda").value);
  const despesas = parseFloat(document.getElementById("despesas").value);
  const meta = parseFloat(document.getElementById("meta").value);
  const gastosExtras = parseFloat(document.getElementById("gastos-extras").value);
  const resultado = document.getElementById("resultado");

  const economia = renda - despesas - gastosExtras;
  const porcentagem = ((economia / renda) * 100).toFixed(1);

  atualizarGrafico(renda, despesas, gastosExtras, economia);
  atualizarMetas(economia);

  localStorage.setItem('simulacao', JSON.stringify({
    renda,
    despesas,
    extras: gastosExtras
  }));

  let mensagem = "";
  if (economia >= meta) {
    mensagem = `🎉 Você pode economizar R$${economia.toFixed(2)} (${porcentagem}%) por mês!`;
  } else if (economia > 0) {
    const tempoParaMeta = Math.ceil(meta / economia);
    mensagem = `⚠️ Você está economizando apenas R$${economia.toFixed(2)}. Levaria ${tempoParaMeta} meses para atingir sua meta de R$${meta}.`;
  } else {
    mensagem = `⚠️ Não é possível economizar com esses valores. Reveja suas despesas e gastos extras.`;
  }

  digitarTexto(resultado, mensagem);
});

// DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = 'Seu resultado...';
  resultado.classList.remove('visible');
  setTimeout(() => resultado.style.opacity = 1, 50);

  // Dark mode
  const isDark = localStorage.getItem('modoEscuro') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
    const toggleBtn = document.getElementById('toggleDarkMode');
    if (toggleBtn) toggleBtn.textContent = '☀️ Modo Claro';
  }

  // Dicas
  iniciarDicas();

  // Simulação salva
  const dadosSalvos = localStorage.getItem('simulacao');
  if (dadosSalvos) {
    const { renda, despesas, extras } = JSON.parse(dadosSalvos);

    document.getElementById('renda').value = renda;
    document.getElementById('despesas').value = despesas;
    document.getElementById('gastos-extras').value = extras;

    const economia = renda - despesas - extras;
    atualizarGrafico(renda, despesas, extras, economia);

    const mensagem = `Você pode economizar R$ ${economia.toFixed(2)} por mês.`;
    digitarTexto(resultado, mensagem);
  }
});
