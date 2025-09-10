import { useState } from "react";

export default function Cadastro() {
  const [programas, setProgramas] = useState([
    {
      nome: "",
      padrao1: "",
      numeros: [{ numero: "", numero_matrizes: "", saldo_giros_inicial: "" }]
    }
  ]);

  const handleProgramaChange = (index, e) => {
    const newProgramas = [...programas];
    newProgramas[index][e.target.name] = e.target.value;
    setProgramas(newProgramas);
  };

  const handleNumeroChange = (progIndex, numIndex, e) => {
    const newProgramas = [...programas];
    newProgramas[progIndex].numeros[numIndex][e.target.name] = e.target.value;
    setProgramas(newProgramas);
  };

  const addNumero = (progIndex) => {
    const newProgramas = [...programas];
    newProgramas[progIndex].numeros.push({ numero: "", numero_matrizes: "", saldo_giros_inicial: "" });
    setProgramas(newProgramas);
  };

  const removeNumero = (progIndex, numIndex) => {
    const newProgramas = [...programas];
    newProgramas[progIndex].numeros.splice(numIndex, 1);
    setProgramas(newProgramas);
  };

  const addPrograma = () => {
    setProgramas([...programas, { nome: "", padrao1: "", numeros: [{ numero: "", numero_matrizes: "", saldo_giros_inicial: "" }] }]);
  };

  const removePrograma = (index) => {
    const newProgramas = programas.filter((_, i) => i !== index);
    setProgramas(newProgramas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [i, programa] of programas.entries()) {
      if (!programa.nome || !programa.padrao1) {
        alert(`Preencha o nome e o padrão1 do programa ${i + 1}`);
        return;
      }
      for (const [j, numero] of programa.numeros.entries()) {
        if (!numero.numero || !numero.numero_matrizes || !numero.saldo_giros_inicial) {
          alert(`Preencha todos os campos da numeração ${j + 1} do programa ${i + 1}`);
          return;
        }
      }
    }

    for (const programa of programas) {
      const res = await fetch("/api/programa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programa)
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Erro ao cadastrar: " + error.error);
        return;
      }
    }

    alert("Todos os programas foram cadastrados com sucesso!");
    setProgramas([{ nome: "", padrao1: "", numeros: [{ numero: "", numero_matrizes: "", saldo_giros_inicial: "" }] }]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cadastro de Programas</h1>
      <form onSubmit={handleSubmit}>
        {programas.map((programa, progIndex) => (
          <div key={progIndex} style={{ border: "1px solid #ccc", marginBottom: "20px", padding: "10px" }}>
            <div>
              <label>Nome do Programa: </label>
              <input type="text" name="nome" value={programa.nome} onChange={(e) => handleProgramaChange(progIndex, e)} required />
            </div>
            <div>
              <label>Padrão1: </label>
              <input type="number" name="padrao1" value={programa.padrao1} onChange={(e) => handleProgramaChange(progIndex, e)} required />
              <button type="button" onClick={() => removePrograma(progIndex)} style={{ marginLeft: "10px" }}>Remover Programa</button>
            </div>

            <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>Numeração</th>
                  <th>Número de Matrizes</th>
                  <th>Saldo de Giros Inicial</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {programa.numeros.map((numero, numIndex) => (
                  <tr key={numIndex}>
                    <td><input type="number" name="numero" value={numero.numero} onChange={(e) => handleNumeroChange(progIndex, numIndex, e)} required /></td>
                    <td><input type="number" name="numero_matrizes" value={numero.numero_matrizes} onChange={(e) => handleNumeroChange(progIndex, numIndex, e)} required /></td>
                    <td><input type="number" name="saldo_giros_inicial" value={numero.saldo_giros_inicial} onChange={(e) => handleNumeroChange(progIndex, numIndex, e)} required /></td>
                    <td><button type="button" onClick={() => removeNumero(progIndex, numIndex)}>Remover</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={() => addNumero(progIndex)} style={{ marginTop: "5px" }}>Adicionar Numeração</button>
          </div>
        ))}
        <button type="button" onClick={addPrograma} style={{ marginRight: "10px" }}>Adicionar Programa</button>
        <button type="submit">Cadastrar Todos</button>
      </form>
    </div>
  );
}
