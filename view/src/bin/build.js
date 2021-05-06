#!/usr/bin/env node
process.env.PUBLIC_URL = 'VSCODE_ROOT_URI/'
process.env.BUILD_PATH = '../media'

const rewire = require("rewire");
const paths = require('react-scripts/config/paths.js');
const defaults = rewire("react-scripts/scripts/build.js");
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')

let config = defaults.__get__("config");

config.optimization.splitChunks = false;
config.optimization.runtimeChunk = false;

const sources = glob.sync(`${paths.appSrc}/**/*`, { nodir: true })
const purgecssPlugin = new PurgecssPlugin({
    paths: [
        paths.appHtml,
        ...sources
    ]
});
const index = config.plugins.findIndex(it => it.constructor?.name === 'ManifestPlugin')
config.plugins.splice(index + 1, 0, purgecssPlugin);
