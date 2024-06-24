export interface MondayConfig {
    leads_verification: {
        board_id: number,
        unverified_group_id: string,
        unverified_status_value: string,
        verified_status_value: string,
        db_updated_status_value: string,
        verification_status_column_id: string,
        email_column_id: string,
        db_id_column_id: string
    }
}