import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method === "GET") {
      const codigo = req.query?.codigo || null;

      if (codigo) {
        const { data: prog, error: errProg } = await supabase
          .from("programas")
          .select("*")
          .eq("codigo", codigo)
          .single();

        if (errProg) return res.status(404).json({ error: "Programa não encontrado" });

        const { data: mat, error: errMat } = await supabase
          .from("matrizaria")
          .select("*")
          .eq("programa_codigo", codigo);

        if (errMat) return res.status(500).json({ error: errMat.message });

        return res.status(200).json({ ...prog, dados_matrizaria: mat });
      }

      const { data, error } = await supabase.from("programas").select("*");
      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(data || []);
    }

    if (req.method === "POST") {
  const { codigo, padrao1, matrizes_opcao, matrizaria } = req.body;

  const { data: programa, error } = await supabase
    .from("programas")
    .insert([{ codigo, padrao1, matrizes_opcao }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // só insere matrizaria se veio algo
  if (matrizaria && Array.isArray(matrizaria)) {
    for (let m of matrizaria) {
      await supabase.from("matrizaria").insert([
        {
          programa_id: programa.id,
          numeracao: m.numeracao,
          matrizes: m.matrizes,
          saldo_inicial: m.saldo_inicial
        }
      ]);
    }
  }

  return res.status(200).json(programa);
}


    if (req.method === "DELETE") {
      const { senha } = req.body || {};
      if (senha !== "24112024") return res.status(403).json({ error: "Senha incorreta" });

      await supabase.from("matrizaria").delete();
      await supabase.from("programas").delete();
      return res.status(200).json({ message: "Banco limpo com sucesso!" });
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno: " + err.message });
  }
}
