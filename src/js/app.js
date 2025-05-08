// Exibe calculadora ao clicar em "Começar"
document.getElementById("btn-comecar").addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".calculadora").classList.remove("hidden");
  document.getElementById("form-calculadora").reset();
  document.getElementById("resultado").textContent = "";

  // Mostrar botão de limpar
  document.getElementById("limparTudo").classList.remove("hidden");
});

// Define sugestão de meta
function definirMeta(valor) {
  document.getElementById("meta").value = valor;
  calcularComCheckboxes();
}

// Lida com o envio do formulário
document.getElementById("form-calculadora").addEventListener("submit", function (e) {
  e.preventDefault();
  calcularComCheckboxes();
});

// Realiza os cálculos
function calcularComCheckboxes() {
  const renda = parseFloat(document.getElementById("renda").value) || 0;
  const despesas = parseFloat(document.getElementById("despesas").value) || 0;
  const meta = parseFloat(document.getElementById("meta").value) || 0;
  const extras = parseFloat(document.getElementById("gastos-extras").value) || 0;

  const economia = renda - despesas - extras;
  const resultado = document.getElementById("resultado");
  const porcentagem = renda > 0 ? ((economia / renda) * 100).toFixed(1) : 0;

  let mensagem = "";
  if (economia >= meta) {
    mensagem = `🎉 Você pode economizar R$${economia.toFixed(2)} (${porcentagem}%) por mês!`;
  } else if (economia > 0) {
    const tempo = Math.ceil(meta / economia);
    mensagem = `⚠️ Você economiza R$${economia.toFixed(2)}. Levaria ${tempo} meses para sua meta.`;
  } else {
    mensagem = `❌ Não é possível economizar com esses valores. Reveja suas despesas.`;
  }

  resultado.textContent = mensagem;
  resultado.style.color = economia >= meta ? "green" : "red";
  resultado.style.opacity = 1;

  atualizarProgressoDasMetas(economia);
}

// Atualiza as metas
function atualizarProgressoDasMetas(economia) {
  const metas = [
    { id: "meta1-progresso", valor: 100 },
    { id: "meta2-progresso", valor: 50 },
    { id: "meta3-progresso", valor: 80 }
  ];

  metas.forEach(meta => {
    const el = document.getElementById(meta.id);
    if (el) {
      const porcentagem = Math.min((economia / meta.valor) * 100, 100).toFixed(0);
      el.textContent = `Atingido ${porcentagem}%`;
    }
  });
}

// Recalcular ao marcar checkboxes da checklist
document.querySelectorAll(".recalcular").forEach(cb => {
  cb.addEventListener("change", calcularComCheckboxes);
});

// =========================
// Carrossel de Dicas
// =========================
const dicas = [
  "🌱 Guardar um pouquinho todo mês não muda sua vida hoje, mas pode abrir caminhos incríveis.",
  "🧾 Saber o que você gasta é liberdade — não controle.",
  "📌 Ter uma meta simples muda o jeito que você enxerga o dinheiro.",
  "💡 Às vezes o que falta não é dinheiro, é um plano.",
  "🎧 Ouça um podcast sobre finanças enquanto caminha.",
  "👟 Comprar com dinheiro guardado tem outro gosto.",
  "🧠 Aprender sobre grana pode ser leve e divertido.",
  "🌟 Só de estar aqui, você já está fazendo mais que muita gente."
];

let dicaAtual = 0;
const dicaTexto = document.getElementById("dicaTexto");
const indicadores = document.getElementById("indicadores");

function mostrarDica(index) {
  dicaTexto.style.opacity = 0;
  setTimeout(() => {
    dicaTexto.textContent = dicas[index];
    dicaTexto.style.opacity = 1;
    atualizarIndicadores();
  }, 300);
}

function atualizarIndicadores() {
  indicadores.innerHTML = "";
  dicas.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("indicador");
    if (i === dicaAtual) dot.classList.add("ativo");
    dot.addEventListener("click", () => {
      dicaAtual = i;
      mostrarDica(dicaAtual);
    });
    indicadores.appendChild(dot);
  });
}

function iniciarCarrossel() {
  mostrarDica(dicaAtual);
  setInterval(() => {
    dicaAtual = (dicaAtual + 1) % dicas.length;
    mostrarDica(dicaAtual);
  }, 7000);
}

window.addEventListener("DOMContentLoaded", iniciarCarrossel);

// =========================
// Botão: Limpar Tudo
// =========================
document.getElementById("limparTudo").addEventListener("click", () => {
  // Limpar inputs
  document.querySelectorAll("input[type='number']").forEach(input => {
    input.value = '';
  });

  // Limpar resultado
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.textContent = '';
  resultadoDiv.style.opacity = 0;

  // Desmarcar checkboxes
  document.querySelectorAll(".recalcular").forEach(cb => {
    cb.checked = false;
  });

  // Resetar metas para 0%
  atualizarProgressoDasMetas(0);
});
