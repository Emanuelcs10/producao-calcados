async function salvarPrograma() {
    const dados = {
        programa: document.getElementById("programa").value.trim(),
        numeracao: document.getElementById("numeracao").value.trim(),
        num_matrizes: Number(document.getElementById("num_matrizes").value),
        saldo_inicial: Number(document.getElementById("saldo_inicial").value),
        horas_produzidas: Number(document.getElementById("horas_produzidas").value)
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

        // Atualiza tabela automaticamente
        buscarPrograma();
    } catch (err) {
        alert("Erro: " + err.message);
        console.error(err);
    }
}
