catch (err) {
  console.error("ERRO API /programa:", err);
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    bodyRecebido: req.body
  });
}
