import { Secteur } from './secteur';

export interface GetUnverifiedSecteursResponse {
    secteur: string;
}

export function unverifiedSecteurToSecteur(data: GetUnverifiedSecteursResponse): Secteur {
    return {
        name: data.secteur,
    };
}