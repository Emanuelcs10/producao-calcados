import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Resolver caminho de arquivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexão PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:8efrmc*3Y6MbB&.@db.fvauluyjupdjtqlexsrb.supabase.co:5432/postgres",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(bodyParser.json());

// Criar tabela se não existir
async function init() {
  await pool.query(`CREATE TABLE IF NOT EXISTS programas (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL
  )`);
}
init();

// Rota principal → carrega frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/cadastro.html"));
});

// Rota GET - lista programas
app.get("/api/programa", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM programas ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar programas:", err);
    res.status(500).json({ error: "Erro ao buscar programas" });
  }
});

// Rota POST - adiciona programa
app.post("/api/programa", async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    if (!nome || !descricao) {
      return res.status(400).json({ error: "Nome e descrição são obrigatórios" });
    }
    const result = await pool.query(
      "INSERT INTO programas (nome, descricao) VALUES ($1, $2) RETURNING *",
      [nome, descricao]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao salvar programa:", err);
    res.status(500).json({ error: "Erro ao salvar programa" });
  }
});

// Inicia servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
