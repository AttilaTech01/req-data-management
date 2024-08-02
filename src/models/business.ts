export interface Business {
    id: number;
    neq: number;
    nom: string;
    secteur: string;
    adresse: string;
    ville: string;
    mrc: string;
    category: string;
    email: string;
    date_creation: string;
}

interface DatabaseBusiness {
    Category: string;
    email: string;
    id: number;
    neq: number;
    secteur: string;
    adresse: string;
    ville: string;
    date_creation: Date;
    nom: string;
    Nom: string;
}

export function convertToBusiness(data: DatabaseBusiness): Business {
    return {
        id: data.id,
        neq: data.neq,
        nom: data.Nom,
        secteur: data.secteur,
        adresse: data.adresse,
        ville: data.ville,
        mrc: data.nom.trim(),
        category: data.Category,
        email: data.email,
        date_creation: data.date_creation.toISOString().slice(0,10)
    };
}