import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { nome, padrao1, numeros } = req.body;

      // Salva programa
      const { data: progData, error: progError } = await supabase
        .from("programas")
        .insert({ nome, padrao1 })
        .select()
        .single();

      if (progError) throw progError;

      const numerosData = numeros.map(n => ({
        programa_id: progData.id,
        numero: n.numero,
        numero_matrizes: n.numero_matrizes,
        saldo_giros_inicial: n.saldo_giros_inicial,
        saldo_giros_atual: n.saldo_giros_inicial // inicia com mesmo valor
      }));

      // Salva as numerações
      const { error: numsError } = await supabase
        .from("numeros")
        .insert(numerosData);

      if (numsError) throw numsError;

      res.status(200).json({ message: "Programa cadastrado com sucesso!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("programas")
        .select("id, nome, padrao1, numeros(*)")
        .order("id", { ascending: true });

      if (error) throw error;
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
