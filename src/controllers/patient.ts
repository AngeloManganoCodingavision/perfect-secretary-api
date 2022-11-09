import { FieldValue } from "firebase-admin/firestore";
import db from "../../firebase";
import { Patient } from "../models/Patients";

const patientsRef = db.collection('patients');

export const getAllPatients = (req: any, res: any, next: any) => {
    patientsRef.where("active", "==", true).get()
    .then((response) => {
        const list: Patient[] = [];
        response.forEach((patient) => {
            list.push({...patient.data() as Patient, id: patient.id });
        });
        res.status(200).json({data: list});
    })
    .catch((error) => {       
        next(error);
    });
};

export const addPatient = (req: any, res: any, next: any) => {
    patientsRef.add({
        ...req.body, 
        added: new Date(req.body.added),
        updated: new Date(req.body.updated)
    })
    .then((newPatient) => {
        res.status(200).send({data: newPatient.id, message: 'Paziente aggiunto con successo'});
    })
    .catch((error) => {       
        next(error);
    });
};

export const updatePatient = (req: any, res: any, next: any) => {
    patientsRef.doc(req.params.id).update({
        added: new Date(req.body.added),
        address: req.body.address,
        badges: req.body.badges,
        birthdate: req.body.birthdate,
        birthplace: req.body.birthplace,
        city: req.body.city,
        email: req.body.email,
        fiscalCode: req.body.fiscalCode,
        gender: req.body.gender,
        lastname: req.body.lastname,
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        postalCode: req.body.postalCode,
        updated: FieldValue.serverTimestamp()
    })
    .then(() => {
        res.status(200).send({data: {...req.body, id: req.params.id}, message: 'Paziente aggiornato con successo'});
    })
    .catch((error) => {       
        next(error);
    });
};

//TODO: cancellare anche lo storico o disattivare
export const deletePatient = (req: any, res: any, next: any) => {
    patientsRef.doc(req.params.id).delete()
    .then(() => {
        res.status(200).send({message:'Il paziente è stato correttamente eliminato'});
    })
    .catch((error) => {       
        next(error);
    });
};