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
		const lastPath = (
			await APP.knex('user_get_requests').orderBy('id', 'desc').limit(1)
		)[0].path;
	
		// check does previous path has query params and make dbQuery if has
		if(RE_questionMark.test(lastPath)){

			const prevQuery = qs.parse(lastPath.replace('/no-js-app?', ''));

			dbQuery = u.makeDBQueryFromReqParamQuery(prevQuery, APP.config.allowedQueryParameters);
		}

	} else {
		if(!u.isEmpty(req.query)){
			dbQuery = u.makeDBQueryFromReqParamQuery(req.query, APP.config.allowedQueryParameters);
		}
	}


	await APP.knex('user_get_requests').insert({uid: req.session.uid, path: req.originalUrl});


	const ejsOptions = {};

	
	//load examples
	const examplesRows = await APP.DB.query({});
	
	ejsOptions.examples = {};

	ejsOptions.examples.cities = examplesRows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`city`)
	).map(e => e.city);

	ejsOptions.examples.plantShops = examplesRows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`plantShop`)
	).map(e => e.plantShop);

	ejsOptions.examples.emploees = examplesRows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`emploee`)
	).map(e => e.emploee);


	if(!u.isEmpty(dbQuery)){

		const rows = await APP.DB.query(dbQuery);

		ejsOptions.cities = rows.filter(
			u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`city`)
		).map(e => e.city);

		ejsOptions.plantShops = rows.filter(
			u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`plantShop`)
		).map(e => e.plantShop);

		ejsOptions.emploees = rows.map(e => e.emploee);

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

		ejsOptions.rows = rows;

		if(!rows.length) {
			ejsOptions.noMatches = true;
		}
	}


	res.render('index', ejsOptions);

});


export default app;
