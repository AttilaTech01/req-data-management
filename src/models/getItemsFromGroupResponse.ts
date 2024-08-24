import { MondayItem, convertToItem } from './mondayItem';

export interface getItemsFromGroupResponse {
    boards: {
        groups: {
            title: string;
            id: string;
            items_page: {
                items: MondayItem[];
            };
        }[];
    }[];
}

export function resultToItemList(data: getItemsFromGroupResponse): MondayItem[] {
    return data?.boards[0].groups[0].items_page.items.map((item) => convertToItem(item));
}
