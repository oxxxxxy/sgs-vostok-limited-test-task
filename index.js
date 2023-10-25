import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


import express from 'express';
import helmet from "helmet";
import compression from 'compression';
import pug from 'pug';
import bodyParser from 'body-parser';
import expressSession from 'express-session';


(await import('dotenv')).config();


import noJsApp from './no-js-app/index.js';
import vueApp from './vue-app/index.js';
import fakeDB from './fakedb.js';
import config from './config.js';
//import db generate file if not exists, connect and etc
//import store from './realdb/index.js';




// для упрощения себе задачи я буду использовать global scope

const APP = {
	DB: fakeDB
	,config: config
};

global.APP = APP;


const app = express();

app.use(compression());


//
// some security
//

app.use(helmet());


//
// public assets
//

app.use(express.static(path.join(__dirname, "public")));

/*

if (process.env.NODE_ENV === 'production') {
	// httpOnly or idk
	// trust proxy etc
	//

}


app.use(expressSession({
	secret: process.env.SESSION_SECRET
	,resave: false
	,saveUninitialized: false
	,store
}));


app.use((q, s, n) => {
	console.log(q.session);

	n();
}):

*/

app.use(bodyParser.urlencoded({parameterLimit:10}));
app.use(bodyParser.json());

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


