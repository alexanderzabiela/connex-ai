import express from 'express';
import { authorisationMiddleware } from './middleware/authorisationMiddleware';
import timeRouter from './routes/time';
import metricsRouter from './routes/metrics';

const app = express();
const PORT = process.env.PORT || 3000;

// Apply routes with authorisation middleware
app.use('/', authorisationMiddleware, timeRouter);
app.use('/', authorisationMiddleware, metricsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});