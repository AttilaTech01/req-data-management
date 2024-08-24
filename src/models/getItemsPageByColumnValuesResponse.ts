import { MondayItem, convertToItem } from './mondayItem';

export interface getItemsPageByColumnValuesResponse {
    cursor?: string;
    items?: MondayItem[];
}

export function resultToItemList(data: getItemsPageByColumnValuesResponse): MondayItem[] {
    return data?.items?.map((item) => convertToItem(item));
}
