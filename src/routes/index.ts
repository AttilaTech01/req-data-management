import express from 'express';
import { getAllItems, getVerifItems } from '../controllers/controller';
//import { createItems, getAllItems } from '../controllers/controller';
const router = express();

// GET
router.get('/', (req, res) => {
  res.json(getHealth());
});

router.get('/health', (req, res) => {
  res.json(getHealth());
  res.end();
});

router.get('/get-all-items', (req, res) => {
  getAllItems(req, res);
});


router.get('/get-verif-items', (req, res) => {
  getVerifItems(req, res);
});

// POST
//router.post('/create-items', (req, res) => {
  //createItems(req, res);
//});//

// FUNCTIONS
function getHealth() {
  return {
    ok: true,
    message: 'Healthy'
  };
}

export default router;
