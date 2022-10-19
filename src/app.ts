import express  from "express";
import 'express-async-errors';
import { FieldValue } from "firebase-admin/firestore";
import db from '../firebase';
import { Patient } from "./models/Patients";

const app = express();
const patientsRef = db.collection('patients');
const eventsRef = db.collection('events');

app.use(express.json());

app.get('/patient', (req, res) => {
    patientsRef.where("active", "==", true).get()
    .then((response) => {
        let list: Patient[] = [];
        response.forEach((patient) => {
            list.push({...patient.data() as Patient, id: patient.id });
        });
        res.status(200).json(list);
    })
    .catch((error) => {
        res.send(error);
    })
});

app.post('/patient', (req, res) => {
    patientsRef.add({...req.body})
    .then((newPatient) => {
        res.status(200).send(newPatient.id);
    })
    .catch((error) => {
        res.send(error);
    })
});

app.patch('/patient/:id', (req, res) => {
    console.log(req.body);    
    patientsRef.doc(req.params.id).update({
        address: req.body.address,
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
        res.status(200).send({...req.body, id: req.params.id});
    })
    .catch((error) => {
        res.send(error);
    })
});

app.delete('/patient/:id', (req, res) => {
    patientsRef.doc(req.params.id).delete()
    .then(() => {
        res.status(200).send('Il paziente è stato correttamente eliminato');
    })
    .catch((error) => {
        res.send(error);
    })
});

export default app;