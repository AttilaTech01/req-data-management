export interface MondayConfig {
    leads_verification: {
        board_id: number;
        unverified_group_id: string;
        unverified_status_value: string;
        verified_status_value: string;
        db_updated_status_value: string;
        verification_status_column_id: string;
        email_column_id: string;
        telephone_column_id: string;
        db_id_column_id: string;
    };
    new_entries: {
        board_id: number;
        group_id: string;
        category_column_id: string;
        city_column_id: string;
        email_column_id: string;
        region_column_id: string;
        secteur_column_id: string;
        foundation_date_column_id: string;
        db_id_column_id: string;
        category_status: string;
        categorized_status_value: string;
        to_categorized_status_value: string;
        duplicates_group_id: string;
        duplicates_status_column_id: string;
        duplicates_ok_status_value: string;
        duplicates_not_ok_status_value: string;
        duplicates_boards_to_check_id: number[];
    };
}
