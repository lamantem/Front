declare namespace DashboardModel {

    export interface EditData {
        user_id: string;
        question_id: string;
        statement: string;
        situation: string;
        action: string;
    }
    export interface GenData {
        uc: string;
        question_id: string;
        statement: string;
        action: string;
    }
    export interface  RateData {
        id: number;
        uc: string;
        user_id: string;
        question_id: string;
        situation: string;
        complaint: string;
        review: string;
    }
    export interface Question {
        question_id: string;
        user_id: string;
        uc_id: string;
        difficulty_id: string;
        statement: string;
        command: string;
        support: string;
        active: any;
    }
    export interface Alternative {
        alternative_id: string;
        question_id: string;
        correct: string;
        alternative: string;
    }
    export interface Complaint {
        complaint_id: string;
        question_id: string;
        user_id: string;
        complaint: string;
        active: any;
    }
    export interface  Difficulty {
        idDificuldade: number;
        dificuldade: string;
    }
    export interface  Uc {
        idUc: number;
        nome: string;
        numero: string;
        idCurso: number;
    }
    export interface  Course {
        idCurso: number;
        nome: string;
    }
    export interface Type {
        idTipo: number;
        tipo: any;
    }
}
