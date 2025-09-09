import express from 'express';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const account = process.env.BLOB_ACCOUNT_NAME;
const key = process.env.BLOB_ACCOUNT_KEY;
const containerName = process.env.BLOB_CONTAINER;

const sharedKeyCredential = new StorageSharedKeyCredential(account, key);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

app.post('/api/programa', async (req, res) => {
  const programa = req.body;
  const blobName = `${programa.codigo}.json`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(JSON.stringify(programa), Buffer.byteLength(JSON.stringify(programa)));
  res.status(200).json({ status: 'Programa salvo ✅' });
});

app.get('/api/programa', async (req, res) => {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const programas = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    programas.push(blob.name);
  }
  res.status(200).json(programas);
});

app.listen(process.env.PORT || 3000, () => console.log('API rodando na porta 3000'));
