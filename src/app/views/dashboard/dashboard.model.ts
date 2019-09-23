declare namespace DashboardModel {

  export interface GroupsReader {
    id: string;
    name: string;
    protocol: string;
    type: string;
    start_date: string;
    end_date: string;
    origin_code: number;
    database_registry: string;
    categories: any;
    moderators: any;
    participants: any;
    periods: any;
    protocols: any;
  }

  export interface ProtocolReader {
    id: string;
    reader_user_access_id: number;
    group_reader_id: number;
    type: string;
    date_read: string;
    registration_code: number;
    end_date: string;
    group_reader: number;
    database_registry: string;
    group_reader_category_id: number;
    group_reader_period_id: number;
    participant_name: string;
    protocol: string;
    start_date: string;
  }

}