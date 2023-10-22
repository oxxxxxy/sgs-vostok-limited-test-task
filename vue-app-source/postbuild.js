import fs from 'node:fs';


const RE_head = /head/;
const RE_assetUrl = /="()\/assets/;


const linkCss = '<link rel="stylesheet" href="/style.css">';
const assetUrlPathToAdd = '/vue-app';


const html = fs.readFileSync('../vue-app/build/index.html', 'utf8');


let fixedHTML = '';
let fixedHead = '';

const re_resultHEAD = html.match(RE_head);



fs.writeFileSync('../vue-app/build/index.html',  fixedHTML);
