import http from 'node:http';
import express from 'express';

import pugApp from './pug-rendering/pug-rendering.js';
import vueApp from './vue-rendering/vue-rendering.js';
import fakeDB from './fakedb.js';


// для упрощения себе задачи я буду использовать global scope
global.DB = fakeDB;



const app = express();
const router = express.Router();


// TODO: make normal init page
app.use('/', (req, res) => {
		res.send(`
				<div><h1>SGS Vostok Limited test task</h1></div>
				<div><a href="/pug">/pug</a> Server-Side Rendering task implementation</div>
				<div><a href="/vue">/vue</a> Client-Side Rendering task implementation</div>
			`);
	}
)

app.use('/pug', pugApp);



const server = http.createServer(app);

server.listen(3000);

server.on('error', console.error);


