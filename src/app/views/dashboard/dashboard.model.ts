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
    participant_id: number;
    moderator_id: number;
    group_reader_id: number;
    protocol_type: string;
    date_reader: string;
    registration_code: number;
    participant_name: string;
  }

  export interface NewParticipant {
    registration_code: number;
    participant_name: string;
  }

}