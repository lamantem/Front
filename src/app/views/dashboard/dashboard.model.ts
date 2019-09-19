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
}