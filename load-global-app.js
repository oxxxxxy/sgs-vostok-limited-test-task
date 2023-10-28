
const config = (await import('./config.js')).default;
import realdb from './realdb/index.js';
import fakedb from './fakedb.js';



export default {
	DB: fakedb
	,config: config
	,knex: realdb
}
