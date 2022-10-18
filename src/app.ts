import express  from "express";
import 'express-async-errors';

const app = express();

app.get('/', (req, res) => {
    res.json({'id': 'ciaone'})
})

export default app;