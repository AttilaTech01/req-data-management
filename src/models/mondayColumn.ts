export interface MondayColumn {
    id: string;
    text: string | number;
}

export function convertToColumn(data: MondayColumn): MondayColumn {
    return {
        id: data.id,
        text: data.text,
    };
}
