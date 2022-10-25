export interface Patient {
    active: boolean;
    added: Date;
    address: string;
    badges: string[];
    birthdate: string;
    birthplace: string;
    city: string;
    email: string;
    fiscalCode: string;
    gender: string;
    id?: string;
    lastname: string;
    name: string;
    phoneNumber: number;
    postalCode: number;
    updated: Date;
}