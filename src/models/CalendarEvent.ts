import { DocumentData, DocumentReference } from "firebase-admin/firestore";

export interface CalendarEvent {
    id? : string;
    added: Date;
    creator: string;
    status: 'scheduled' | 'payed' | 'jumped';
    patientRef: DocumentReference | DocumentData;
    start: Date;
    title: string;
}