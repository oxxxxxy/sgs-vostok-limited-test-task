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
	,maxAge: 2 * 1000 // make 60 * 60 * 1000
};

if (process.env.NODE_ENV === 'dev-deploy') {
	
	cookie.secure = true;

}


const knexSesStore_Get = KnexSessionStore.prototype.get;
KnexSessionStore.prototype.get = function (...args) {

	console.log(this, args, 'get');

	knexSesStore_Get.apply(this, args);	 
}

const knexSesStore_Set = KnexSessionStore.prototype.set;
KnexSessionStore.prototype.set = function (...args) {

	console.log(this, args, 'set');

	knexSesStore_Set.apply(this, args);	 
}

const knexSesStore_Touch = KnexSessionStore.prototype.touch;
KnexSessionStore.prototype.touch = function (...args) {

	console.log(this, args, 'touch');

	knexSesStore_Touch.apply(this, args);	 
}

const knexSesStore_Destroy = KnexSessionStore.prototype.destroy;
KnexSessionStore.prototype.destroy = function (...args) {

	console.log(this, args, 'destroy');

	knexSesStore_Destroy.apply(this, args);	 
}

const knexSesStore_Length = KnexSessionStore.prototype.length;
KnexSessionStore.prototype.length = function (...args) {

	console.log(this, args, 'length');

	knexSesStore_Length.apply(this, args);	 
}

const knexSesStore_Clear = KnexSessionStore.prototype.clear;
KnexSessionStore.prototype.clear = function (...args) {

	console.log(this, args, 'clear');

	knexSesStore_Clear.apply(this, args);	 
}

const knexSesStore_StopDbCleanup = KnexSessionStore.prototype.stopDbCleanup;
KnexSessionStore.prototype.stopDbCleanup = function (...args) {

	console.log(this, args, 'stopDbCleanup');

	knexSesStore_StopDbCleanup.apply(this, args);	 
}

const knexSesStore_GetNextDbCleanup = KnexSessionStore.prototype.getNextDbCleanup;
KnexSessionStore.prototype.getNextDbCleanup = function (...args) {

	console.log(this, args, 'getNextDbCleanup');

	knexSesStore_GetNextDbCleanup.apply(this, args);	 
}

const knexSesStore_All = KnexSessionStore.prototype.all;
KnexSessionStore.prototype.All = function (...args) {

	console.log(this, args, 'all');

	knexSesStore_All.apply(this, args);	 
}


/*
 
  getNextDbCleanup: [Function (anonymous)],
  all: 

 */


console.log(
	// String(knexSesStoreDestroy)
	// ,String(KnexSessionStore)
	KnexSessionStore.prototype
);

const store = new KnexSessionStore({
		knex: APP.knex
	});

console.log(String(store.destroy))




app.use(expressSession({
	secret: process.env.SESSION_SECRET
	,resave: true
	,saveUninitialized: true
	,store: store
	,name: 'sid'
	,cookie: cookie
}));


// i understand this is a bad design solution
// there should be solution based on something else
// because express-session aims to handle authed sessions
// and must refresh sessionID token for security reason
// but i havenot enough experience and want to finish that task as fast as i can
// to demonstrate my desire to become developer and get more experience as possible
// if i have enough time i will recode this solution to a more right one
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
		// user first time visit
		// insert his date inside  table users
		// get uid
		// insert request at every path in   table user_requests
		//	set uid to session

		const access_date = (new Date()).toISOString();

		try {
			const res = await APP.knex('users').returning('id').insert({access_date});

			req.session.uid = res[0].id;
		} catch(e) {
			console.error(e);
		}
	
	}
	//	user next time visit
	//	get uid from session
	//	insert request in   table user_requests


	next();
});

// db sanitizer of user and his reqs after expired time

// fn setInterval(() => {})
// search users limit 50
// search each user in session
//		if session has not this user delete all his data
//

const delay = ms => new Promise(r => setTimeout(r,  ms));

const dbSanitizer = async () => {
	// that bad solution was made only beacause i can't patch expressSession
	// to set or can...

	const limit = 50;
	let offset = 0;

	while(true) {
		
		await delay();


		let users;
		try {

			users = await APP.knex('users')
				.select('*')
				.orderBy('id', 'desc')
				.limit(limit)
				.offset(offset);

		} catch(e) {
			console.error(e);
		}

		// console.log(users)
		
		if(!users.length){

			offset = 0;

			continue;
		}


		let sessions;
		try {

			sessions = await APP.knex('sessions')
				.select('*')
				.limit(limit)
				.offset(offset);

		} catch(e) {
			console.error(e);
		}

		const sessionUids = sessions.map(e => (JSON.parse(e.sess)).uid);

		// console.log(sessionUids);


		return;
		

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
	
	try {
		await APP.knex('user_get_requests').insert({uid: req.session.uid, path: req.originalUrl});
	} catch (e) {
		console.error(e);
	}

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


