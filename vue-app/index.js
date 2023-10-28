import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';


import u from '../utils.js';



/*
 * Global APP
 */


const router = express.Router();

router.use('/assets', express.static(path.join(__dirname, 'build', 'assets')));


router.get('/api/search', async (req, res) => {
	
	try {
		await APP.knex('user_get_requests').insert({uid: req.session.uid, path: req.originalUrl});
	} catch (e) {
		console.error(e);
	}

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


router.get('/', async (req, res) => {

	try {
		await APP.knex('user_get_requests').insert({uid: req.session.uid, path: req.originalUrl});
	} catch (e) {
		console.error(e);
	}

	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


export default router;
