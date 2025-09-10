// Detecta ambiente: local ou produção
const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:3000/api/programa"
    : "https://producao-calcados-suza.vercel.app//api/programa"; // produção no Vercel

// Função para salvar programa (POST)
async function salvarPrograma() {
    const dados = {
        programa: document.getElementById("programa").value.trim(),
        numeracao: document.getElementById("numeracao").value.trim(),
        num_matrizes: Number(document.getElementById("num_matrizes").value),
        saldo_inicial: Number(document.getElementById("saldo_inicial").value),
        horas_produzidas: Number(document.getElementById("horas_produzidas").value)
    };

    // Validação simples
    if (!dados.programa || !dados.numeracao || !dados.num_matrizes || !dados.saldo_inicial || !dados.horas_produzidas) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    try {
        const response = await fetch(apiBaseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error || "Erro ao salvar programa");
        }

        const resultado = await response.json();
        alert("Programa salvo com sucesso!");
        console.log("Registro salvo:", resultado);

        // Atualiza tabela automaticamente após salvar
        buscarPrograma();
    } catch (err) {
        alert("Erro: " + err.message);
        console.error(err);
    }
}

// Função para buscar programa (GET)
async function buscarPrograma() {
    const codigo = document.getElement
