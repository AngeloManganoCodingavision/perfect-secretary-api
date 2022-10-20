import { DocumentData, DocumentReference } from "firebase-admin/firestore";

export interface CalendarEvent {
    id? : string;
    added: Date;
    creator: string;
    patientRef: DocumentReference | DocumentData;
    title: string;
    start: Date;
}