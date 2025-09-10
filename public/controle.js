import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

// Calcula horas produzidas e status com padrão3
function calcularHorasStatus(programa) {
  if (!programa.numeros || programa.numeros.length === 0) return { horasProduzidas: 0, status: "N/A" };

  // Seleciona a numeração com maior saldo de giros
  const maiorSaldoObj = programa.numeros.reduce((prev, curr) =>
    curr.saldo_giros_atual > prev.saldo_giros_atual ? curr : prev
  , programa.numeros[0]);

  // Cálculo do padrão3
  const divisor = (maiorSaldoObj.numero_matrizes === 12 || maiorSaldoObj.numero_matrizes === 18)
    ? maiorSaldoObj.numero_matrizes
    : 12; // regra de fallback
  const padrao3 = (programa.padrao1 / divisor) * maiorSaldoObj.numero_matrizes;

  // Diferença de giros
  const diffGiros = maiorSaldoObj.saldo_giros_atual - maiorSaldoObj.saldo_giros_inicial;

  // Horas produzidas
  const horasProduzidas = diffGiros / padrao3;

  // Status
  let status;
  if (horasProduzidas < 0) status = "Adiantado";
  else if (horasProduzidas > 0) status = "Atrasado";
  else status = "Dentro do prazo";

  return {
    horasProduzidas,
    status,
    numMaiorSaldo: maiorSaldoObj.numero,
    saldoInicial: maiorSaldoObj.saldo_giros_inicial,
    saldoAtual: maiorSaldoObj.saldo_giros_atual
  };
}

export default function Controle() {
  const [programas, setProgramas] = useState([]);

  useEffect(() => {
    async function fetchProgramas() {
      const { data, error } = await supabase
        .from("programas")
        .select("id, nome, padrao1, numeros(id, numero, numero_matrizes, saldo_giros_inicial, saldo_giros_atual)")
        .order("id", { ascending: true });

      if (error) console.error("Erro ao buscar programas:", error);
      else setProgramas(data);
    }

    fetchProgramas();
    const interval = setInterval(fetchProgramas, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Controle de Produção</h1>
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Programa</th>
            <th>Numeração Maior Saldo</th>
            <th>Saldo de Giros Inicial</th>
            <th>Saldo de Giros Atual</th>
            <th>Horas Produzidas</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {programas.map(p => {
            const { horasProduzidas, status, numMaiorSaldo, saldoInicial, saldoAtual } = calcularHorasStatus(p);
            const color = status === "Atrasado" ? "red" : status === "Adiantado" ? "lightgreen" : "yellow";

            return (
              <tr key={p.id} style={{ backgroundColor: color }}>
                <td>{p.nome}</td>
                <td>{numMaiorSaldo}</td>
                <td>{saldoInicial}</td>
                <td>{saldoAtual}</td>
                <td>{horasProduzidas.toFixed(2)}</td>
                <td>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
