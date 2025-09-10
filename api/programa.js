// server.js
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Habilita CORS
app.use(cors());
app.use(express.json());

// Conexão com PostgreSQL via DATABASE_URL
// Ex.: postgres://usuario:senha@host:porta/banco
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // necessário se estiver usando Heroku ou cloud
    }
});

// Rota para buscar dados do programa
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

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
