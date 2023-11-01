import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
import helmet from "helmet";
import qs from 'qs';

import u from '../utils.js';


const RE_questionMark = /\?/;

/*
 * Global APP
 */

// i know, this is bad design choice, but there is no way or i can't find that way( bz this is not required )
// to connect the express router with the page render engine

const app = express();


app.use(helmet());
app.use((req, res, next) => {

	res.set('X-XSS-Protection', '1; mode=block');

  next();
});


app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");


app.get('/', async (req, res) => {

	let dbQuery;

	// getting cached query parameters if it were
	if(!RE_questionMark.test(req.originalUrl)){
		
		const row = await APP.knex('user_get_requests').orderBy('id', 'desc').limit(1);

		if(row.length){

			const lastPath = row[0].path;
		
			// check does previous path has query params and make dbQuery if has
			if(RE_questionMark.test(lastPath)){

				const prevQuery = qs.parse(lastPath.replace('/no-js-app?', ''));

				dbQuery = u.makeDBQueryFromReqParamQuery(prevQuery, APP.config.allowedQueryParameters);
			}
		}
	} else {
		if(!u.isEmpty(req.query)){
			dbQuery = u.makeDBQueryFromReqParamQuery(req.query, APP.config.allowedQueryParameters);
		}
	}


	await APP.knex('user_get_requests').insert({uid: req.session.uid, path: req.originalUrl});


	const ejsOptions = {
		examples: {}
	};

	
	//load first time visit and examples 
	const examplesRows = await APP.DB.query({});

	ejsOptions.cities = u.getListOfUniqValuesFromRows(examplesRows, 'city');
	ejsOptions.examples.cities = ejsOptions.cities;

	ejsOptions.plantShops = u.getListOfUniqValuesFromRows(examplesRows, 'plantShop');
	ejsOptions.examples.plantShops = ejsOptions.plantShops;
	
	ejsOptions.emploees = u.getListOfUniqValuesFromRows(examplesRows, 'emploee');
	ejsOptions.examples.emploees = ejsOptions.emploees;


	// workSchelude options 
	const workFrom = u.getListOfUniqValuesFromRows(examplesRows, 'workFrom');

	const workUntil = u.getListOfUniqValuesFromRows(examplesRows, 'workUntil');

	ejsOptions.workSchelude = workFrom.map((e, i) => 
		(
			{
				from: e
				,until: workUntil[i]
			}
		)
	);


	ejsOptions.rows = [];

	if(dbQuery){

		const rows = await APP.DB.query(dbQuery);
	
		ejsOptions.cities = u.getListOfUniqValuesFromRows(rows, 'city');

		ejsOptions.plantShops = u.getListOfUniqValuesFromRows(rows, 'plantShop');
	
		ejsOptions.emploees = u.getListOfUniqValuesFromRows(rows, 'emploee');

		ejsOptions.rows = rows;

		if(!rows.length) {
			ejsOptions.noMatches = true;
		}
	}


	res.render('index', ejsOptions);

});


export default app;
