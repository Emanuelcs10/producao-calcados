const tabela = document.getElementById("tabelaMatrizaria");

// Exemplo de dados iniciais
const matrizaria = [
  { numeracao: "36", matrizes: 12, saldoInicial: 100, saldoAtual: 80 },
  { numeracao: "37", matrizes: 12, saldoInicial: 120, saldoAtual: 110 },
];

// Padrão 1 (exemplo)
const padrao1 = 240;
document.getElementById("padrao1").value = padrao1;

function calcularHorasProduzidas(saldoInicial, saldoAtual, padrao3) {
  // (diferença de giros / padrao3 - horas) * 0.6
  const diferenca = saldoInicial - saldoAtual;
  const horasProduzidas = ((diferenca / padrao3)) * 0.6;
  return horasProduzidas;
}

function calcularResultado(horasProduzidas) {
  // resultado = hora inicio + horas produzidas - hora atual
  const agora = new Date();
  const horaInicio = new Date();
  horaInicio.setHours(6, 0, 0); // exemplo 06:00
  const resultado = (horaInicio.getTime() + horasProduzidas * 3600 * 1000 - agora.getTime()) / 60000; // em minutos
  return resultado;
}

function renderTabela() {
  tabela.innerHTML = "";
  matrizaria.forEach(item => {
    const padrao2 = padrao1 / item.matrizes;
    const padrao3 = padrao2 * item.matrizes; // simplificado, você pode ajustar

    const horasProduzidas = calcularHorasProduzidas(item.saldoInicial, item.saldoAtual, padrao3);
    const resultado = calcularResultado(horasProduzidas);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border px-2 py-1">${item.numeracao}</td>
      <td class="border px-2 py-1">${item.matrizes}</td>
      <td class="border px-2 py-1">${item.saldoInicial}</td>
      <td class="border px-2 py-1">${item.saldoAtual}</td>
      <td class="border px-2 py-1">${horasProduzidas.toFixed(2)}</td>
      <td class="border px-2 py-1 ${resultado >= 0 ? 'text-green-600' : 'text-red-600'}">
        ${resultado >= 0 ? '+' : ''}${resultado.toFixed(2)}
      </td>
    `;
    tabela.appendChild(tr);
  });
}

renderTabela();
