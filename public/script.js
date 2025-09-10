async function salvarPrograma() {
  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const secao = document.getElementById("secao").value;

  try {
    const response = await fetch("/api/programa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, descricao, secao })
    });

    if (!response.ok) throw new Error("Erro ao salvar");

    alert("Programa salvo com sucesso!");
    document.getElementById("nome").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("secao").value = "";
    carregarProgramas();
  } catch (err) {
    alert("Erro: " + err.message);
  }
}

async function carregarProgramas() {
  try {
    const response = await fetch("/api/programa");
    const data = await response.json();
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    let ultimaSecao = "";
    data.forEach(p => {
      if (p.secao !== ultimaSecao) {
        const secaoLi = document.createElement("li");
        secaoLi.textContent = "== Seção: " + p.secao + " ==";
        secaoLi.style.fontWeight = "bold";
        lista.appendChild(secaoLi);
        ultimaSecao = p.secao;
      }

      const li = document.createElement("li");
      li.textContent = `${p.nome} - ${p.descricao}`;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar programas:", err);
  }
}

// Carregar programas ao abrir a página
window.onload = carregarProgramas;
