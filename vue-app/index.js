import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';


import u from '../utils.js';



/*
 * Global APP
 */


const app = express();

app.use('/assets', express.static('./build/assets'));


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

	const workFrom = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`workFrom`)
	).map(e => e.workFrom);

	const workUntil = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`workUntil`)
	).map(e => e.workUntil);

	const workSchelude = workFrom.map((e, i) => 
		(
			{
				from: e
				,until: workUntil[i]
			}
		)
	);

	res.json({
		dataLists: {
			cities
			,plantShops
			,emploees
			,workSchelude
		}
		,rows
	});
});


app.get('/', (req, res) => {
	res.sendFile('./build/index.html'));
});


export default app;
