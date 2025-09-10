const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Habilita CORS e leitura de JSON
app.use(cors());
app.use(express.json());

// Conexão PostgreSQL via DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// -----------------------
// Rota GET: buscar programa
// -----------------------
app.get("/api/programa/:codigo", async (req, res) => {
    const codigo = req.params.codigo;

    try {
        const query = `
            SELECT numeracao, num_matrizes, saldo_inicial, saldo_atual, horas_produzidas, tempo_planejado
            FROM producao
            WHERE programa = $1
            ORDER BY numeracao
        `;
        const { rows } = await pool.query(query, [codigo]);

        res.json(rows);
    } catch (err) {
        console.error("Erro ao buscar produção:", err);
        res.status(500).json({ error: "Erro ao buscar produção" });
    }
});

// -----------------------
// Rota POST: salvar programa
// -----------------------
app.post("/api/programa", async (req, res) => {
    const { programa, numeracao, num_matrizes, saldo_inicial, saldo_atual, horas_produzidas, tempo_planejado } = req.body;

    if (!programa || !numeracao) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    try {
        const query = `
            INSERT INTO producao 
            (programa, numeracao, num_matrizes, saldo_inicial, saldo_atual, horas_produzidas, tempo_planejado)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
        `;
        const values = [programa, numeracao, num_matrizes, saldo_inicial, saldo_atual, horas_produzidas, tempo_planejado];
        const { rows } = await pool.query(query, values);

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error("Erro ao salvar programa:", err);
        res.status(500).json({ error: "Erro ao salvar programa" });
    }
});

// -----------------------
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
