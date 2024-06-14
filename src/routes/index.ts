import express from 'express';
import {
    getAllItems,
    getUnVerifiedSecteurs,
    getUnVerifiedLeads,
    UpdateNonVerifSecteurs,
    UpdateVerifiedLeads,
} from '../controllers/controller';
//import { createItems, getAllItems } from '../controllers/controller';
const router = express();

// INDEX
router.get('/', (req, res) => {
    res.json(getHealth());
});

router.get('/health', (req, res) => {
    res.json(getHealth());
    res.end();
});

// LEADS
router.get('/get-all-items', (req, res) => {
    getAllItems(req, res);
});

router.get('/get-unverified-leads', (req, res) => {
    getUnVerifiedLeads(req, res);
});

router.patch('/update-verified-leads', (req, res) => {
    UpdateVerifiedLeads(req, res);
});

// SECTEURS
router.get('/get-unverified-secteur', (req, res) => {
    getUnVerifiedSecteurs(req, res);
});

router.post('/create-verif-secteur', (req, res) => {
    UpdateNonVerifSecteurs(req, res);
});

// FUNCTIONS
function getHealth() {
    return {
        ok: true,
        message: 'Healthy',
    };
}

export default router;
