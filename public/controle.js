import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

// Calcula o status com base nas horas produzidas e tempo planejado
function calcularStatus(programa) {
  const horaAtual = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Fortaleza" })
  );
  const tempoPlanejado = new Date(programa.tempo_planejado);

  const horasPlanejadas = (horaAtual - tempoPlanejado) / 1000 / 3600;
  const diff = programa.horas_produzidas - horasPlanejadas;

  if (diff > 0) return "Atrasado";
  if (diff < 0) return "Adiantado";
  return "Dentro do prazo";
}

export default function Controle() {
  const [programas, setProgramas] = useState([]);

  useEffect(() => {
    async function fetchProgramas() {
      const { data, error } = await supabase
        .from("programas")
        .select("*")
        .order("data_criacao", { ascending: true });

      if (error) console.error("Erro ao buscar programas:", error);
      else setProgramas(data);
    }

    fetchProgramas();
    const interval = setInterval(fetchProgramas, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  // Atualiza localmente o valor de horas produzidas
  const handleHorasChange = (id, value) => {
    setProgramas(programas.map(p => p.id === id ? { ...p, horas_produzidas: value } : p));
  };

  // Salva horas produzidas no Supabase
  const salvarHoras = async (id, horas) => {
    const res = await fetch(`/api/programa/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ horas_produzidas: parseFloat(horas) })
    });

    if (!res.ok) {
      const error = await res.json();
      alert("Erro ao salvar horas: " + error.error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Controle de Produção</h1>
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Matrizaria</th>
            <th>Número de Matrizes</th>
            <th>Saldo de Giros Inicial</th>
            <th>Horas Produzidas</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {programas.map(p => {
            const status = calcularStatus(p);
            const color = status === "Atrasado" ? "red" : status === "Adiantado" ? "lightgreen" : "yellow";

            return (
              <tr key={p.id} style={{ backgroundColor: color }}>
                <td>{p.nome}</td>
                <td>{p.matriz}</td>
                <td>{p.numero_matrizes}</td>
                <td>{p.saldo_giros_inicial}</td>
                <td>
                  <input
                    type="number"
                    value={p.horas_produzidas}
                    step="0.01"
                    onChange={(e) => handleHorasChange(p.id, e.target.value)}
                    style={{ width: "80px" }}
                  />
                </td>
                <td>{status}</td>
                <td>
                  <button onClick={() => salvarHoras(p.id, p.horas_produzidas)}>Salvar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
