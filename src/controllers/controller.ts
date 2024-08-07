import reqService from '../services/req-service';

export async function getAllItems(req, res): Promise<void> {
    try {
        await reqService.getAllItems(req);
        return res
            .status(200)
            .send({ message: 'items fetched successfully' });
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

// LEADS
export async function getUnVerifiedLeads(req, res): Promise<void> {
    try {
        const data = await reqService.getUnVerifiedLeads(req);
        return res
            .status(200)
            .send({ message: 'items fetched successfully', data: data });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'internal server error', error: err });
    }
}

export async function UpdateVerifiedLeads(req, res): Promise<void> {
    try {
        const data = await reqService.UpdateVerifiedLeads(req);
        return res
            .status(200)
            .send({ message: 'items updated successfully', data: data });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'internal server error', error: err });
    }
}

// SECTEURS
export async function getUnVerifiedSecteurs(req, res): Promise<void> {
    try {
        const data = await reqService.getUnVerifiedSecteurs();
        return res
            .status(200)
            .send({ message: 'items fetched successfully', data: data });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'internal server error' });
    }
}

export async function createVerifiedSecteurs(req, res): Promise<void> {
    try {
        const data = await reqService.createVerifiedSecteurs();
        return res
            .status(200)
            .send({ message: 'items updated successfully', data: data });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'internal server error' });
    }
}
