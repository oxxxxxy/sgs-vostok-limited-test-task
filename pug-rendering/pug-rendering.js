import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';


const app = express();

app.set('views', path.join(
		path.dirname(fileURLToPath(import.meta.url))
		,'views'
	)
);
app.set("view engine", "pug");

app.get('/', (req, res) => {
//	res.render('index',)
});







export default app;
