import express  from "express";
import 'express-async-errors';
import db from '../firebase';

const app = express();

app.get('/', async (req, res) => {
    const snapshot = await db.collection('patients').get();
    let list: any[] = [];
    snapshot.forEach((doc) => {
        list.push(doc.data());
    });
    res.status(200).json(list)
})

export default app;