import { Business } from './business';

export interface GetUnverifiedLeadsResponse {
    id: number;
    ville: string;
    email: string;
    neq: number;
    category_name: string;  
    mrc_name: string;
    company_name: string;
}

export function unverifiedLeadToBusiness(data: GetUnverifiedLeadsResponse): Business {
    return {
        id: data.id,
        neq: data.neq,
        name: data.company_name,
        ville: data.ville,
        mrc: data.mrc_name.trim(),
        category: data.category_name,
        email: data.email
    };
}