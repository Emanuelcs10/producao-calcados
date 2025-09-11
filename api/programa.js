import { createClient } from "@supabase/supabase-js";

// Crie variáveis de ambiente no Vercel:
// SUPABASE_URL → URL do Supabase
// SUPABASE_SERVICE_ROLE_KEY → service_role key para escrita

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { nome, padrao1, numeros } = req.body;

    // Validação básica
    if (!nome || typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ error: "Nome do programa é obrigatório" });
    }
    if (!padrao1 || typeof padrao1 !== "number" || padrao1 <= 0) {
      return res.status(400).json({ error: "Padrão1 inválido" });
    }
    if (!Array.isArray(numeros) || numeros.length === 0) {
      return res.status(400).json({ error: "Adicione pelo menos uma numeração" });
    }

    // Validação de cada numeração
    for (const n of numeros) {
      if (
        n.numero === undefined || n.numero < 0 ||
        n.numero_matrizes === undefined || n.numero_matrizes <= 0 ||
        n.saldo_giros_inicial === undefined || n.saldo_giros_inicial < 0
      ) {
        return res.status(400).json({ error: "Numeração inválida: " + JSON.stringify(n) });
      }
    }

    // Insere programa
    const { data: progData, error: progError } = await supabase
      .from("programas")
      .insert({ nome, padrao1 })
      .select()
      .single();

    if (progError) throw progError;

    // Insere numerações
    const numerosData = numeros.map(n => ({
      programa_id: progData.id,
      numero: n.numero,
      numero_matrizes: n.numero_matrizes,
      saldo_giros_inicial: n.saldo_giros_inicial,
      saldo_giros_atual: n.saldo_giros_inicial
    }));

    const { error: numsError } = await supabase
      .from("numeros")
      .insert(numerosData);

    if (numsError) throw numsError;

    // Resposta JSON de sucesso
    res.status(200).json({ message: "Programa cadastrado com sucesso!" });

  } catch (err) {
    console.error("ERRO API /programa:", err);
    // Retorna JSON mesmo em erro
    res.status(500).json({ error: err.message || "Erro interno no servidor" });
  }
}
