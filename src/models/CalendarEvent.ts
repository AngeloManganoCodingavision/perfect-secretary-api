import { DocumentData, DocumentReference } from "firebase-admin/firestore";

export interface CalendarEvent {
    id? : string;
    added: Date;
    creator: string;
    isJumped: boolean;
    isPayed: boolean;
    patientRef: DocumentReference | DocumentData;
    start: Date;
    title: string;
}