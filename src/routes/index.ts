import express from 'express';
import {
    duplicatesVerification,
    getAllItems,
    getUnVerifiedSecteurs,
    getUnVerifiedLeads,
    createVerifiedSecteurs,
    UpdateVerifiedLeads,
    updateLeadsCategorisation as updateLeadsCategorisation,
} from '../controllers/controller';

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
router.get('/get-all-items', (req, res, next) => {
    getAllItems(req, res, next);
});

router.patch('/update-categorized-leads', (req, res, next) => {
    updateLeadsCategorisation(req, res, next);
});

router.get('/verify-duplicates', (req, res, next) => {
    duplicatesVerification(req, res, next);
});

// VERIFICATION
router.get('/get-unverified-leads', (req, res, next) => {
    getUnVerifiedLeads(req, res, next);
});

router.patch('/update-verified-leads', (req, res, next) => {
    UpdateVerifiedLeads(req, res, next);
});

// SECTEURS
router.get('/get-unverified-secteur', (req, res, next) => {
    getUnVerifiedSecteurs(req, res, next);
});

router.post('/create-verif-secteur', (req, res, next) => {
    createVerifiedSecteurs(req, res, next);
});

// FUNCTIONS
function getHealth() {
    return {
        ok: true,
        message: 'Healthy',
    };
}

export default router;
