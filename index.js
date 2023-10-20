import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
import helmet from "helmet";
import compression from 'compression';
import pug from 'pug';

import noJsApp from './no-js-app/index.js';
import vueApp from './vue-app/index.js';
import fakeDB from './fakedb.js';

// для упрощения себе задачи я буду использовать global scope
// и подобие базы данных
global.DB = fakeDB;


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


//
// app
//

app.use('/no-js-app', noJsApp);

//app.use('/vue-app', vueApp);

const indexPage = pug.compileFile('./index.pug')();
app.get('/', (req, res) => {
	res.send(indexPage);
});

app.use((req, res, next) => {
  res.status(404).sendStatus(404);
})


//
// server
// 

const server = http.createServer(app);

server.listen(process.env.PORT || 3000);

server.on('error', console.error);


