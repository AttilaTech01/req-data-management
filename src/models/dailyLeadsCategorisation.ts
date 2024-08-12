export const textToIdMap = {
    Construction: 1,
    Tourisme: 2,
    Agriculture: 3,
    Services: 4,
    Finance: 5,
    Transport: 6,
    Technologie: 7,
    'Commerce and retail': 8,
    'Art, Cultures, Loisir': 9,
    Industriel: 10,
    Santé: 11,
    'Real Estate': 12,
    Éducation: 13,
    Énergie: 14,
    'Services Pro': 15,
};
export interface Column {
    id: string;
    text: string | number;
}

export interface Item {
    id?: number;
    name?: string;
    column_values?: Column[];
}

export interface getItemsPageByColumnValuesResponse {
    cursor?: string;
    items?: Item[];
}

export function resultToItemList(data: getItemsPageByColumnValuesResponse): Item[] {
    return data?.items?.map((item) => convertToItem(item));
}

function convertToItem(data: Item): Item {
    return {
        id: data.id,
        name: data.name,
        column_values: data?.column_values?.map((column) => convertToColumn(column)),
    };
}

function convertToColumn(data: Column): Column {
    return {
        id: data.id,
        text: data.text,
    };
}
