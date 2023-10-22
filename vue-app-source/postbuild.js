import fs from 'node:fs';


const RE_head = /<head>([\s\S]*)<\/head>/;
const RE_assetUrl = /="\/assets/g;


const add_linkCss = '<link rel="stylesheet" href="/style.css">';
const add_assetUrlPath = '="/vue-app/assets';


const html = fs.readFileSync('../vue-app/build/index.html', 'utf8');

const re_HEAD = html.match(RE_head);

const headWithReplacedUrls = re_HEAD[1].replaceAll(RE_assetUrl, add_assetUrlPath)
const headWithAddedCss = headWithReplacedUrls + add_linkCss;

const fixedHTML = html.replace(re_HEAD[1], headWithAddedCss);

fs.writeFileSync('../vue-app/build/index.html',  fixedHTML);
