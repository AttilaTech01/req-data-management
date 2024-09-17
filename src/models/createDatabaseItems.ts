import Joi from 'joi';

export const createDbItemReq = Joi.object({
    email: Joi.string(),
    companyName: Joi.string().required(),
    ville: Joi.string().required(),
    secteur: Joi.string(),
    telephone: Joi.string(),
});

export interface CreateItem {
    email: string;
    companyName: string;
    ville: string;
    secteur: string;
    telephone: string;
}
