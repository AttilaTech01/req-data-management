import reqService from '../services/req-service';

export async function getAllItems(req, res): Promise<void> {
    try {
        const data = await reqService.getAllItems(req);
        return res
            .status(200)
            .send({ message: 'items fetched successfully', data: data });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'internal server error', error: err });
    }
}

// LEADS
export async function getUnVerifiedLeads(req, res): Promise<void> {
    try {
        const data = await reqService.getUnVerifiedLeads();
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

export async function UpdateNonVerifSecteurs(req, res): Promise<void> {
    try {
        const data = await reqService.UpdateVerifiedSecteurs();
        return res
            .status(200)
            .send({ message: 'items updated successfully', data: data });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'internal server error' });
    }
}
