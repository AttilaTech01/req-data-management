import express from 'express';
const router = express();

router.get('/', (req, res) => {
  res.json(getHealth());
});

router.get('/health', (req, res) => {
  res.json(getHealth());
  res.end();
});

router.post('/create-items', (req, res) => {
  res.send('POST request to /create-items');
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy'
  };
}

export default router;
