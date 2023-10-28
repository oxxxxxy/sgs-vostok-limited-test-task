import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
import helmet from "helmet";

import u from '../utils.js';



/*
 * Global APP
 */

// i know, this is bad design choice, but there is no way or i can't find that way( bz this is not required )
// to connect the express router with the page render engine

const app = express();


app.use(helmet());
app.use((req, res, next) => {
	req.app.disable('x-powered-by');

	res.set('X-XSS-Protection', '1; mode=block');

  next();
});


app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");


app.get('/', async (req, res, next) => {

	console.log(req, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', res)

	// req.
	//	if it was nojsapp path then
	//		previous dbQuery if has then search by it
	//		if has not, parse from new req and create/replace previous by uid
	//	if it was any other path
	//		just render it on page
	// const dbQuery = u.makeDBQueryFromReqParamQuery(req.query, APP.config.allowedQueryParameters);


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
