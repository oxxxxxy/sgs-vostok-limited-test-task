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

	let dbQuery = {};

	if(!u.isEmpty(req.query)){
		dbQuery = u.makeDBQueryFromReqParamQuery(req.query, allowedQueryParameters);
	}

	const rows = await DB.query(dbQuery);

	console.log(rows.slice(0, 3));

	const cities = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`city`)
	);
	const cityExamples = cities.slice(0, 5);

	const plantShops = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`plantShop`)
	);
	const plantShopExamples = plantShops.slice(0, 5);

	const emploees = rows.filter(
		u.getFnFilterObjsByPropValueAndGetArrOfPropValues(`emploee`)
	);
	const emploeeExamples = emploees.slice(0, 5);
																	

	res.render('index')
});


export default app;
