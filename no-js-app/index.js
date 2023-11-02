import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
import helmet from "helmet";
import ejs from 'ejs';
import qs from 'qs';

import u from '../utils.js';


const RE_questionMark = /\?/;

/*
 * Global APP
 */


const router = express.Router();


const viewsPath = path.join(__dirname, 'views');

const indexPagePath = path.join(viewsPath, 'index.ejs');

const index = fs.readFileSync(indexPagePath, 'utf8');

const indexPageTemplate = ejs.compile(index, { filename: indexPagePath });


router.get('/', async (req, res) => {

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


	const data = {
		examples: {}
	};

	
	//load first time visit and examples 
	const examplesRows = await APP.DB.query({});

	data.cities = u.getListOfUniqValuesFromRows(examplesRows, 'city');
	data.examples.cities = data.cities;

	data.plantShops = u.getListOfUniqValuesFromRows(examplesRows, 'plantShop');
	data.examples.plantShops = data.plantShops;
	
	data.emploees = u.getListOfUniqValuesFromRows(examplesRows, 'emploee');
	data.examples.emploees = data.emploees;


	// workSchelude options 
	const workFrom = u.getListOfUniqValuesFromRows(examplesRows, 'workFrom');

	const workUntil = u.getListOfUniqValuesFromRows(examplesRows, 'workUntil');

	data.workSchelude = workFrom.map((e, i) => 
		(
			{
				from: e
				,until: workUntil[i]
			}
		)
	);


	data.rows = [];

	if(dbQuery){

		const rows = await APP.DB.query(dbQuery);
	
		data.cities = u.getListOfUniqValuesFromRows(rows, 'city');

		data.plantShops = u.getListOfUniqValuesFromRows(rows, 'plantShop');
	
		data.emploees = u.getListOfUniqValuesFromRows(rows, 'emploee');

		data.rows = rows;

		if(!rows.length) {
			data.noMatches = true;
		}
	}


	res.send(indexPageTemplate(data));

});


export default router;

