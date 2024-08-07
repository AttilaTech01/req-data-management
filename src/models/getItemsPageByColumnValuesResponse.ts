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
    return data?.items?.map(item => convertToItem(item))
}

function convertToItem(data: Item): Item {
    return {
        id: data.id,
        name: data.name,
        column_values: data?.column_values?.map(column => convertToColumn(column))
    };
}

function convertToColumn(data: Column): Column {
    return {
        id: data.id,
        text: data.text,
    };
}