import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: "ok",
    version: "1.0.0",
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});


export default router;
