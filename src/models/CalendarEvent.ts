import { DocumentData, DocumentReference } from "firebase-admin/firestore";

export interface CalendarEvent {
    id? : string;
    added: Date;
    color: string;
    creator: string;
    end: Date;
    note?: string;
    partnerRef?: DocumentReference | DocumentData; // get | post
    patientRef: DocumentReference | DocumentData; // get | post
    start: Date;
    status: EventStatus;
    title: string;
    type: EventType;
}

export enum EventStatus {
    Scheduled = 'scheduled',
    Payed = 'payed',
    Jumped = 'jumped'
}

export enum EventType {
    Visit = 'visit',
    Couple = 'couple',
    Test = 'test',
    Ctu_ctp = 'ctu/ctp',
    Private = 'private'
  }