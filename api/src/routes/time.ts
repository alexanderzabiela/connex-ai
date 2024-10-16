import { Router } from 'express';

const router = Router();

router.get('/time', (req, res) => {
  const currentTime = Math.floor(Date.now() / 1000);
  res.json({ epoch: currentTime });
});

export default router;
