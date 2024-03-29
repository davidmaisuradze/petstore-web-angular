// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import {renderModuleFactory} from '@angular/platform-server';
import {enableProdMode} from '@angular/core';
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import {join} from 'path';
import {readFileSync} from 'fs';
import {ngExpressEngine} from '@nguniversal/express-engine';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'petstore-web-angular', 'index.html')).toString();

const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./petstore-web-server/main');


app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'petstore-web-angular'));

// Server static files from /petstore-web-angular
app.get('*.*', express.static(join(DIST_FOLDER, 'petstore-web-angular')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'petstore-web-angular', 'index.html'), {req});
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
