//App.js
import express from 'express'
import shortenRouter from './routes/shorten.routes.js'
import { handleRedirect } from './controllers/shorten.controller.js';

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/shorten", shortenRouter);
app.get('/:shortCode', handleRedirect);


export default app;

