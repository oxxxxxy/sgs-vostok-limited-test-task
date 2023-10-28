import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));



export default (await import('knex')).default({
	client: 'sqlite3'
	,connection: {
		filename: path.join(__dirname, 'sgs-task.db')
	}
	,useNullAsDefault: false
});









