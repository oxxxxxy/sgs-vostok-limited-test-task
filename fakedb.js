import assert from 'node:assert';

import u from './utils.js';

/*	
 *	Этот файл имитирует базу данных и запросы к бд.
 *
 */


const fakeTable = [
	{city:'Gorod ABC', plantShop:'Цех ABC', workFrom:8, workUntil:20, brigade:'Brigada ABC', emploee:'Petya Ivanov'}
	,{city:'Gorod ABC', plantShop:'Цех ABC', workFrom:8, workUntil:20, brigade:'Brigada ABC', emploee:'Vasya Grishev'}
	,{city:'Gorod ABC', plantShop:'Цех ABC', workFrom:8, workUntil:20, brigade:'Brigada ABC', emploee:'Jora Petrov'}
	,{city:'Gorod ABC', plantShop:'Цех ABC', workFrom:20, workUntil:8, brigade:'Brigada BCA', emploee:'Petya Ivanov 2'}
	,{city:'Gorod ABC', plantShop:'Цех ABC', workFrom:20, workUntil:8, brigade:'Brigada BCA', emploee:'Vasya Grishev 2'}
	,{city:'Gorod ABC', plantShop:'Цех ABC', workFrom:20, workUntil:8, brigade:'Brigada BCA', emploee:'Jora Petrov 2'}
	,{city:'Gorod ABC', plantShop:'Цех BCA', workFrom:8, workUntil:20, brigade:'Brigada ABC 2', emploee:'Petya Ivanov 3'}
	,{city:'Gorod ABC', plantShop:'Цех BCA', workFrom:8, workUntil:20, brigade:'Brigada ABC 2', emploee:'Vasya Grishev 3'}
	,{city:'Gorod ABC', plantShop:'Цех BCA', workFrom:8, workUntil:20, brigade:'Brigada ABC 2', emploee:'Jora Petrov 3'}
	,{city:'Gorod ABC', plantShop:'Цех BCA', workFrom:20, workUntil:8, brigade:'Brigada BCA 2', emploee:'Petya Ivanov 23'}
	,{city:'Gorod ABC', plantShop:'Цех BCA', workFrom:20, workUntil:8, brigade:'Brigada BCA 2', emploee:'Vasya Grishev 23'}
	,{city:'Gorod ABC', plantShop:'Цех BCA', workFrom:20, workUntil:8, brigade:'Brigada BCA 2', emploee:'Jora Petrov 23'}
	,{city:'Gorod BCA', plantShop:'Цех ABC 2', workFrom:8, workUntil:20, brigade:'Brigada ABC 3', emploee:'Petya Ivanov 4'}
	,{city:'Gorod BCA', plantShop:'Цех ABC 2', workFrom:8, workUntil:20, brigade:'Brigada ABC 3', emploee:'Vasya Grishev 4'}
	,{city:'Gorod BCA', plantShop:'Цех ABC 2', workFrom:8, workUntil:20, brigade:'Brigada ABC 3', emploee:'Jora Petrov 4'}
	,{city:'Gorod BCA', plantShop:'Цех ABC 2', workFrom:20, workUntil:8, brigade:'Brigada BCA 3', emploee:'Petya Ivanov 24'}
	,{city:'Gorod BCA', plantShop:'Цех ABC 2', workFrom:20, workUntil:8, brigade:'Brigada BCA 3', emploee:'Vasya Grishev 24'}
	,{city:'Gorod BCA', plantShop:'Цех ABC 2', workFrom:20, workUntil:8, brigade:'Brigada BCA 3', emploee:'Jora Petrov 24'}
	,{city:'Gorod BCA', plantShop:'Цех BCA 2', workFrom:8, workUntil:20, brigade:'Brigada ABC 23', emploee:'Petya Ivanov 34'}
	,{city:'Gorod BCA', plantShop:'Цех BCA 2', workFrom:8, workUntil:20, brigade:'Brigada ABC 23', emploee:'Vasya Grishev 34'}
	,{city:'Gorod BCA', plantShop:'Цех BCA 2', workFrom:8, workUntil:20, brigade:'Brigada ABC 23', emploee:'Jora Petrov 34'}
	,{city:'Gorod BCA', plantShop:'Цех BCA 2', workFrom:20, workUntil:8, brigade:'Brigada BCA 23', emploee:'Petya Ivanov 234'}
	,{city:'Gorod BCA', plantShop:'Цех BCA 2', workFrom:20, workUntil:8, brigade:'Brigada BCA 23', emploee:'Vasya Grishev 234'}
	,{city:'Gorod BCA', plantShop:'Цех BCA 2', workFrom:20, workUntil:8, brigade:'Brigada BCA 23', emploee:'Jora Petrov 234'}
];


const fakeFindRequest = function (queryObj) {
	const doesRowMatchQuery = (row, REQueryObj) => {
		const keys = Object.keys(REQueryObj);

		return keys.every(k => {

			if( typeof row[k] === 'string'){
				return Array.isArray(
					row[k].match(new RegExp(REQueryObj[k]))
				)
			}else{
				return row[k] === REQueryObj[k];
			}

		});
	};

	if(u.isEmpty(queryObj)){
		return this.table;
	}	else {

		let arr = this.table.filter(e => doesRowMatchQuery(e, queryObj));

		if(!Array.isArray(arr)) {
			arr = [];
		}

		return arr;
	}
}

const FakeDataBase = {
	table: fakeTable
	,query (queryObj) {
		const fakeFindRequestBound = fakeFindRequest.bind(this);

		return new Promise(res => {
				setTimeout(() => {
						res(fakeFindRequestBound(queryObj));
					});
			});
	}
};


export default FakeDataBase;



// simple test

const testQuery = {workUntil:8, city:'Gorod BCA'};
const testQueryRes = await FakeDataBase.query(testQuery);

assert.ok(
	testQueryRes.every(e =>
		e.workUntil === testQuery.workUntil
		&& e.city === testQuery.city
	)
);
