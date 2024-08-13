import reqService from '../services/req-service';

// LEADS
export async function getAllItems(req, res, next): Promise<void> {
    try {
        await reqService.getAllItems(req);
        return res
            .status(200)
            .send({ message: 'new leads fetched successfully' });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export async function dailyLeadsCategorisation(req, res, next): Promise<void> {
    try {
        /*
        const rule = new schedule.RecurrenceRule();
        rule.hour = 12;
        const job = schedule.scheduleJob(rule, async function () {
            const categorisedLeads = await reqService.dailyLeadsCategorisation();
        });
        */
        await reqService.dailyLeadsCategorisation();

        return res.status(200).send({ message: 'items categorized successfully' });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

// VERIFICATION
export async function getUnVerifiedLeads(req, res, next): Promise<void> {
    try {
        const data = await reqService.getUnVerifiedLeads(req);
        return res
            .status(200)
            .send({ message: 'unverified leads fetched successfully', data: data });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export async function UpdateVerifiedLeads(req, res, next): Promise<void> {
    try {
        const data = await reqService.UpdateVerifiedLeads(req);
        return res
            .status(200)
            .send({ message: 'verified leads updated successfully', data: data });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

// SECTEURS
export async function getUnVerifiedSecteurs(req, res, next): Promise<void> {
    try {
        const data = await reqService.getUnVerifiedSecteurs();
        return res
            .status(200)
            .send({ message: 'items fetched successfully', data: data });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export async function createVerifiedSecteurs(req, res, next): Promise<void> {
    try {
        const data = await reqService.createVerifiedSecteurs();
        return res
            .status(200)
            .send({ message: 'items updated successfully', data: data });
    } catch (err) {
        console.error(err);
        next(err);
    }
}
