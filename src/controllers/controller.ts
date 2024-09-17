import reqService from '../services/req-service';
import { Duplicate } from '../models/duplicate';
import Joi from 'joi';
import { createDbItemReq } from '../models/createDatabaseItems';

// LEADS
export async function getAllItems(req, res, next): Promise<void> {
    try {
        await reqService.getAllItems(req);
        return res.status(200).send({ message: 'new leads fetched successfully' });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export async function updateLeadsCategorisation(req, res, next): Promise<void> {
    try {
        await reqService.updateLeadsCategorisation(req);

        return res.status(200).send({ message: 'items categorized successfully' });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export async function duplicatesVerification(req, res, next): Promise<void> {
    try {
        const response: Duplicate[] = await reqService.duplicatesVerification(req);

        return res.status(200).send({
            message: 'Duplicates have been verified successfully',
            data: response,
        });
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

export async function CreateDbLeads(req, res, next): Promise<void> {
    try {
        const { error } = createDbItemReq.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const data = await reqService.CreateDatabaseItems(req);
        return res.status(200).send({ message: 'The items was created in the DB' });
    } catch (err) {
        console.error(err);
        next(err);
    }
}
