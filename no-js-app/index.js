import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';

import u from '../utils.js';

console.log(__dirname)


/*
 * Global APP
 */


const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");


app.get('/', async (req, res) => {

	const dbQuery = u.makeDBQueryFromReqParamQuery(req.query, APP.config.allowedQueryParameters);


	const rows = await APP.DB.query(dbQuery);

	const ejsOptions = {};


	ejsOptions.cities = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`city`)
	).map(e => e.city);
	ejsOptions.cityExamples = ejsOptions.cities.slice(0, 5);

	ejsOptions.plantShops = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`plantShop`)
	).map(e => e.plantShop);
	ejsOptions.plantShopExamples = ejsOptions.plantShops.slice(0, 5);

	ejsOptions.emploees = rows.map(e => e.emploee);
	ejsOptions.emploeeExamples = ejsOptions.emploees.slice(0, 5);


	const workFrom = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`workFrom`)
	).map(e => e.workFrom);

	const workUntil = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`workUntil`)
	).map(e => e.workUntil);

	ejsOptions.workSchelude = workFrom.map((e, i) => 
		(
			{
				from: e
				,until: workUntil[i]
			}
		)
	);


	ejsOptions.rows = [];

	if(!u.isEmpty(req.query)){
		ejsOptions.rows = rows;
	}


	if(!rows.length) {	
		ejsOptions.noMatches = true;
	}

	res.render('index', ejsOptions);

});


export default app;
