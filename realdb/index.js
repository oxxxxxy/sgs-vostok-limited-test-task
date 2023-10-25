import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


import sqlite from 'sqlite3';
import expressSession from 'express-session';
import knex from 'knex';


const KnexSessionStore = (await import('connect-session-knex')).default(expressSession);


/*
 *	Global APP
 */









const store = new KnexSessionStore({
	knex: APP.knex
});


export default store;
