// src/index.ts

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express from 'express';
import cors from 'cors';
import { authorisationMiddleware } from './middleware/authorisationMiddleware';
import timeRouter from './routes/time';
import expressPrometheusMiddleware from 'express-prometheus-middleware';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Apply authorisation middleware to '/metrics' endpoint
app.use('/metrics', authorisationMiddleware);

// Use express-prometheus-middleware to serve metrics at '/metrics'
app.use(
  expressPrometheusMiddleware({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
  })
);

// Apply authorisation middleware and mount routers
app.use('/time', authorisationMiddleware, timeRouter);

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for testing
export default app;
