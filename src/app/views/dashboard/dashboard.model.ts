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
        uc: string;
        user_id: string;
        question_id: string;
        situation: string;
        complaint: string;
        review: string;
    }
}
