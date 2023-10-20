import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';

import u from '../utils.js';



const allowedQueryParameters = [
	'city'
	,'plantShop'
	,'workFrom'
	,'workUntil'
	,'brigade'
	,'emploee'
];



/*
 * Global DB
 */


const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");


app.get('/', async (req, res) => {

	const dbQuery = u.makeDBQueryFromReqParamQuery(req.query, allowedQueryParameters);

	const rows = await DB.query(dbQuery);

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


	ejsOptions.rows = [];

	if(!u.isEmpty(req.query)){
		ejsOptions.rows = rows;
	}


	if(!rows.length) {	
		ejsOptions.noMatches = true;
	}

console.log(
	ejsOptions.cities,
ejsOptions.cityExamples,
ejsOptions.plantShopExamples,
ejsOptions.emploeeExamples
);

	res.render('index', ejsOptions);

});


export default app;
