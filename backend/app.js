import express from 'express'
import shortenRouter from './routes/shorten.routes.js'
import analyticsRouter from './routes/analytics.routes.js'
import { handleRedirect } from './controllers/shorten.controller.js';
import { unknownEndpoint, errorHandler } from './middlewares/error.middleware.js';
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors({
  exposedHeaders: ["Retry-After"]
}))

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/shorten", shortenRouter);
app.use("/api/analytics", analyticsRouter);
app.get('/:shortCode', handleRedirect);

app.use(unknownEndpoint);
app.use(errorHandler);


export default app;

