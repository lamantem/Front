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

  export interface ReportSync {
    id: number;
    created_at: any;
    added: number;
    reject: number;
    group_id: any;
  }

  export interface ProtocolReader {
    participant_id: number;
    categories_id: number;
    moderator_id: number;
    group_reader_id: number;
    protocol_type: string;
    date_reader: string;
    registration_code: number;
    participant_name: string;
    period: string;
  }

  export interface NewParticipant {
    registration_code: number;
    participant_name: string;
  }

}
