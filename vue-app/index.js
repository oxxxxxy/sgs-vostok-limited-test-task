import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
import bodyParser from 'body-parser';


import u from '../utils.js';



const app = express();


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './build')));

// app /api to handle reqs

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './build/index.html'));
});







export default app;
