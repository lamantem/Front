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
    categorias: any;
    moderadores: any;
    participantes: any;
    turnos: any;
  }

  export interface ProtocolReader {
    id: string;
    reader_user_access_id: number;
    group_reader_participant_id: number;
    type: string;
    read_date: string;
    registration_code: number;
    end_date: string;
    group_reader: number;
    database_registry: string;
    group_reader_category_id: number;
    group_reader_period_id: number;
    name: string;
    participant_name: string;
    protocol: string;
    reader_user_acess_id: number;
    start_date: string;
  }
}