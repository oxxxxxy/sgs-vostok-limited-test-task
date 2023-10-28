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
	req.app.disable('x-powered-by');

	res.set('X-XSS-Protection', '1; mode=block');

  next();
});


//
// public assets
//

app.use(express.static(path.join(__dirname, "public")));



const cookie = {
	maxAge: 30 * 1000			// i guess it is good value for demonstration purposes
	,sameSite: true
};

if (process.env.NODE_ENV === 'dev-deploy') {
	
	cookie.secure = true;

}

app.use(expressSession({
	secret: process.env.SESSION_SECRET
	,resave: false
	,saveUninitialized: true
	,store: new KnexSessionStore({
		knex: APP.knex
	})
	,name: 'sid'
	,cookie: cookie
}));

// TODO:
// create, refresh session
//		uuid
//
// save user pathes
// show cookie, user acitons on pages
//


app.use((q, s, n) => {
	// console.log(q, '\nAAAAAAAAAAAAAAABETWEEN REQ AND RESAAAAAAAAAAAA\n', s);

	n();
});



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


