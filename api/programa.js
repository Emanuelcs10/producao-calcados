import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Caminho absoluto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// Conexão com PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Testa conexão e cria tabela
async function init() {
  try {
    console.log("Testando conexão com o banco...");
    await pool.query("SELECT 1");
    console.log("Conexão OK");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS programas (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT NOT NULL
      )
    `);
    console.log("Tabela criada/verificada com sucesso");
  } catch (err) {
    console.error("Erro inicializando o banco:", err);
  }
}
init();

// Rota GET - listar programas
app.get("/api/programa", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM programas ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar programas:", err);
    res.status(500).json({ error: "Erro ao buscar programas" });
  }
});

// Rota POST - salvar programa
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
    console.log("Programa salvo:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao salvar programa:", err);
    res.status(500).json({ error: "Erro ao salvar programa" });
  }
});

// Rota raiz - carrega frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/cadastro.html"));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
