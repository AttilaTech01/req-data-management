import { Business } from './business';

export interface GetItemsResponse {
    email: string;
    id_localisation: number;
    localisation_neq: number;
    secteur: string;
    adresse: string;
    ville: string;
    category: string;
    mrc_name: string;
    company_name: string;
    date_creation: Date;
}

export function itemToBusiness(data: GetItemsResponse): Business {
    return {
        id: data.id_localisation,
        neq: data.localisation_neq,
        name: data.company_name,
        secteur: data.secteur,
        adresse: data.adresse,
        ville: data.ville,
        mrc: data.mrc_name.trim(),
        category: data.category,
        email: data.email,
        date_creation: data.date_creation ? data.date_creation.toISOString().slice(0,10) : ''
    };
}