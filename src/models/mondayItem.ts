import { MondayColumn, convertToColumn } from './mondayColumn';

export interface MondayItem {
    id?: number;
    name?: string;
    column_values?: MondayColumn[];
}

export function convertToItem(data: MondayItem): MondayItem {
    return {
        id: data.id,
        name: data.name,
        column_values: data?.column_values?.map((column) => convertToColumn(column)),
    };
}
