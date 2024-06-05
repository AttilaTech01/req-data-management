import express from 'express';
import { createItems } from '../controllers/controller';

const router = express();

router.get('/', (req, res) => {
  res.json(getHealth());
});

router.get('/health', (req, res) => {
  res.json(getHealth());
  res.end();
});

router.post('/create-items', (req, res) => {
  createItems(req, res);
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy'
  };
}

export default router;
