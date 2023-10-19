import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
import validator from 'validator';


/*
 * Global DB
 */


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "pug");


app.get('/', async (req, res) => {
	const rows = await DB.query();

	res.render('index')
});

app.get('/submit', async (req, res) => {
	console.log(req);
	res.redirect('/pug')
});






export default app;
