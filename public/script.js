// Detecta se está local ou produção
const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:3000/api/programa"
    : "/api/programa"; // Vercel usa o mesmo domínio

async function salvarPrograma() {
    const dados = {
        programa: document.getElementById("programa").value.trim(),
        numeracao: document.getElementById("numeracao").value.trim(),
        num_matrizes: Number(document.getElementById("num_matrizes").value),
        saldo_inicial: Number(document.getElementById("saldo_inicial").value),
        saldo_atual: Number(document.getElementById("saldo_atual").value),
        horas_produzidas: Number(document.getElementById("horas_produzidas").value),
        tempo_planejado: Number(document.getElementById("tempo_planejado").value)
    };

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
    } catch (err) {
        alert("Erro: " + err.message);
        console.error(err);
    }
}
