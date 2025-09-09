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
      const { codigo, padrao1, qtd_matrizes, dados_matrizaria } = req.body;

      if (!codigo) return res.status(400).json({ error: "Campo 'codigo' obrigatório" });

      const { error: errUpsert } = await supabase
        .from("programas")
        .upsert({ codigo, padrao1, qtd_matrizes });

      if (errUpsert) return res.status(500).json({ error: errUpsert.message });

      await supabase.from("matrizaria").delete().eq("programa_codigo", codigo);

      if (Array.isArray(dados_matrizaria) && dados_matrizaria.length > 0) {
        const rows = dados_matrizaria.map(it => ({
          programa_codigo: codigo,
          numeracao: it.numeracao,
          matrizes: it.matrizes,
          giros_inicial: it.girosInicial
        }));
        const { error: errInsert } = await supabase.from("matrizaria").insert(rows);
        if (errInsert) return res.status(500).json({ error: errInsert.message });
      }

      return res.status(200).json({ message: "Programa salvo com sucesso!" });
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