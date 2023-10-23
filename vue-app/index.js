import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';


import u from '../utils.js';



/*
 * Global APP
 */


const app = express();

app.use('/assets', express.static(path.join(__dirname, 'build', 'assets')));


app.get('/api/examples', async (req, res) => {

	const rows = await APP.DB.query();


	const cities = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`city`)
	).map(e => e.city).slice(0, 5);

	const plantShops = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`plantShop`)
	).map(e => e.plantShop).slice(0, 5);

	const emploees = rows.map(e => e.emploee).slice(0, 5);


	res.json({
		dataLists: {
			cities
			,plantShops
			,emploees
		}
	});
});

app.get('/api/search', async (req, res) => {

	const dbQuery = u.makeDBQueryFromReqParamQuery(req.query, APP.config.allowedQueryParameters);

	const rows = await APP.DB.query(dbQuery);


	const cities = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`city`)
	).map(e => e.city);

	const plantShops = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`plantShop`)
	).map(e => e.plantShop);

	const emploees = rows.map(e => e.emploee);


	res.json({
		dataLists: {
			cities
			,plantShops
			,emploees
		}
		,rows
	});
});


app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


export default app;
