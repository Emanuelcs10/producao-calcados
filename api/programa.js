import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Criar tabela (executar uma vez)
const init = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS programas (
      codigo TEXT PRIMARY KEY,
      padrao1 INTEGER,
      matrizes_opcao INTEGER
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS matrizaria (
      id SERIAL PRIMARY KEY,
      codigo_programa TEXT REFERENCES programas(codigo),
      numeracao TEXT,
      matrizes INTEGER,
      saldo_inicial INTEGER
    );
  `);
};
init();

// Rotas
app.post('/api/programa', async (req, res) => {
  const { codigo, padrao1, matrizes_opcao, matrizaria } = req.body;

  try {
    await pool.query(
      'INSERT INTO programas (codigo, padrao1, matrizes_opcao) VALUES ($1, $2, $3) ON CONFLICT (codigo) DO UPDATE SET padrao1=$2, matrizes_opcao=$3',
      [codigo, padrao1, matrizes_opcao]
    );

    for (let m of matrizaria) {
      await pool.query(
        'INSERT INTO matrizaria (codigo_programa, numeracao, matrizes, saldo_inicial) VALUES ($1,$2,$3,$4)',
        [codigo, m.numeracao, m.matrizes, m.saldo_inicial]
      );
    }

    res.status(200).json({ status: 'Programa salvo ✅' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar programa' });
  }
});

app.get('/api/programa', async (req, res) => {
  try {
    const programasRes = await pool.query('SELECT * FROM programas');
    res.status(200).json(programasRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar programas' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('API rodando na porta 3000'));
