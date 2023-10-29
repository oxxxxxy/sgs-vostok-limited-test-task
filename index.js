import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


import express from 'express';
import helmet from "helmet";
import compression from 'compression';
import pug from 'pug';
import expressSession from 'express-session';


(await import('dotenv')).config();
const KnexSessionStore = (await import('connect-session-knex')).default(expressSession);


import noJsApp from './no-js-app/index.js';
import vueApp from './vue-app/index.js';



//
// for simplicity, i am going to use GLOBAL
//

global.APP = (await import('./load-global-app.js')).default;


//
// The beggining of the whole application
//

const app = express();

app.use(compression());


//
// some security
//

app.use(helmet());

app.use((req, res, next) => {

	res.set('X-XSS-Protection', '1; mode=block');

  next();
});


//
// public assets
//

app.use(express.static(path.join(__dirname, "public")));


//
//	session and cookie thing
//

const cookie = {
	sameSite: true
	,maxAge: 60 * 60 * 1000
};

if (process.env.NODE_ENV === 'dev-deploy') {
	
	cookie.secure = true;

}

app.use(expressSession({
	secret: process.env.SESSION_SECRET
	,resave: true
	,saveUninitialized: true
	,store: new KnexSessionStore({
			knex: APP.knex
		})
	,name: 'sid'
	,cookie: cookie
}));


// i understand this is a bad design solution
// there should be solution based on something else
// because express-session aims to handle authed sessions
// and must refresh sessionID token for security reason
// but i havenot enough experience to find out right way
// and i want to finish that task
// to demonstrate my desire to become developer and get more experience as possible
// if i have enough time i will recode this solution to a more right one i guess
//
// and i read some papers about designing http cookie
// and it say that, storing user data right in the cookie is a bad solution
// and i agree with that
// because cookie must store only nessary data about auth
// and can't be accepted via client-side JS
// so if it important to store or cache some temporary user data such as list of goods
// then devs must use localStorage( as me at vue app ) or any other client-side DB-things
// or database on the server-side


//	session handler

app.use(async (req, res, next) => {

	if(!req.session.uid){

		const access_date = (new Date()).toISOString();

		const res = await APP.knex('users').returning('id').insert({access_date});

		req.session.uid = res[0].id;
	
	}

	next();
});


// db sanitizer of user and his reqs after expired time

const delay = ms => new Promise(r => setTimeout(r,  ms));

const dbSanitizer = async () => {
	// that bad solution was made only beacause i can't patch expressSession
	// to access destoying sessions to remove users and their data too
	// but i will find out better solution

	const limit = 50;
	let offset = 0;

	while(true) {
		
		await delay();


		const hourAgo = new Date(Date.now() - 60*60*1000)

		const users = await APP.knex('users')
				.select('*')
				.where('access_date', '<', hourAgo.toISOString())
				.orderBy('access_date', 'asc')
				.limit(limit)
				.offset(offset);


		if(!users.length){

			offset = 0;

			continue;
		}


		const uids = users.map(e => e.id);

		await APP.knex('user_get_requests')
			.whereIn('uid', uids)
			.del()

		await APP.knex('users')
			.whereIn('id', uids)
			.del()
		

		offset = offset + limit;

	}
}

dbSanitizer();


//
// app
//

app.use('/no-js-app', noJsApp);
app.use('/vue-app', vueApp);

const indexPage = pug.compileFile('./index.pug')();
app.get('/', async (req, res) => {
	res.send(indexPage);
});

app.use((req, res, next) => {
  res.sendStatus(404);
})


//
// server
// 

const server = http.createServer(app);

server.listen(process.env.PORT || 3000);

server.on('error', console.error);


