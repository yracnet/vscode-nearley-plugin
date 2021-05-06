#!/usr/bin/env node

process.env.PUBLIC_URL = 'VSCODE_ROOT_URI/'
process.env.BUILD_PATH = '../media'

const rewire = require("rewire");
const defaults = rewire("react-scripts/scripts/build.js");
let config = defaults.__get__("config");

config.optimization.splitChunks = false;
config.optimization.runtimeChunk = false;
//config.output.publicPath = '__URI_EXTENSION__/'
//console.log('config', config);
console.log('config.output.publicPath', config.output.publicPath);