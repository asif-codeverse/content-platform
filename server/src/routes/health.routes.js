import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    environment:process.env.NODE_ENV,
    timestamp: Date.now(),
  });
});


export default router;
