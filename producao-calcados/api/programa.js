export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({ status: "GET funcionando 🚀" });
  } else if (req.method === "POST") {
    res.status(200).json({ status: "POST funcionando 🚀" });
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
