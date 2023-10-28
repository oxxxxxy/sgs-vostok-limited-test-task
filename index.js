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
// beacause express-session aims to handle authed sessions
// and must refresh sessionID token for security reason


//	session handler

app.use((q, s, n) => {
	// console.log(q, '\nAAAAAAAAAAAAAAABETWEEN REQ AND RESAAAAAAAAAAAA\n', s);
	//
	
	// user first time visit
	// insert his date inside  table users
	// get uid
	// insert request in   table user_requests
	//	set uid to session

	//	user next time visit
	//	get uid from session
	//	update his last_req_date
	//	insert request in   table user_requests
	//

	//
	//
	//
	// set uid for new user add get from session store
	//
	// delete user and his actions after 1h
	//

	if(!q.session.uid){
		console.log('no uid')
		q.session.uid = 1;
	} else{
		console.log('has uid', q.session.uid)
	}

	n();
});

//	session sanitizer after 1h

// fn delete user session, and actions


//
// app
//

app.use('/no-js-app', noJsApp);
app.use('/vue-app', vueApp);

const indexPage = pug.compileFile('./index.pug')();
app.get('/', (req, res) => {
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


