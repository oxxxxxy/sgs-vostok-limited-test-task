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

	const dbQuery = u.makeDBQueryFromReqParamQuery(req.query, APP.config.allowedQueryParameters);

	const rows = await APP.DB.query(dbQuery);


	const cities = u.getListOfUniqValuesFromRows(rows, 'city');

	const plantShops = u.getListOfUniqValuesFromRows(rows, 'plantShop');

	const emploees = u.getListOfUniqValuesFromRows(rows, 'emploee');

	const workFrom = u.getListOfUniqValuesFromRows(rows, 'workFrom');

	const workUntil = u.getListOfUniqValuesFromRows(rows, 'workUntil');

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
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


export default router;
