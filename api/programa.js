// api/programa.js
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Função principal para lidar com GET e POST
export default async function handler(req, res) {
    if (req.method === "GET") {
        // Busca os dados de produção
        const codigo = req.query.codigo;
        if (!codigo) return res.status(400).json({ error: "Código do programa é obrigatório" });

        try {
            const query = `
                SELECT numeracao, num_matrizes, saldo_inicial, saldo_atual, horas_produzidas, tempo_planejado
                FROM producao
                WHERE programa = $1
                ORDER BY numeracao
            `;
            const { rows } = await pool.query(query, [codigo]);
            return res.status(200).json(rows);
        } catch (err) {
            console.error("Erro ao buscar produção:", err);
            return res.status(500).json({ error: "Erro ao buscar produção" });
        }

    } } else if (req.method === "POST") {
    const { programa, numeracao, num_matrizes, saldo_inicial, horas_produzidas } = req.body;

    if (!programa || !numeracao || !num_matrizes || !saldo_inicial || !horas_produzidas) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    try {
        const query = `
            INSERT INTO producao 
            (programa, numeracao, num_matrizes, saldo_inicial, saldo_atual, horas_produzidas, tempo_planejado)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
        `;
        // saldo_atual = saldo_inicial, tempo_planejado = 0
        const values = [programa, numeracao, num_matrizes, saldo_inicial, saldo_inicial, horas_produzidas, 0];
        const { rows } = await pool.query(query, values);

        return res.status(201).json(rows[0]);
    } catch (err) {
        console.error("Erro ao salvar programa:", err);
        return res.status(500).json({ error: "Erro ao salvar programa" });
    }
}
        }

    } else {
        return res.status(405).json({ error: "Método não permitido" });
    }
}
