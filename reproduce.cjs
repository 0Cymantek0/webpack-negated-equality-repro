"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const webpack = require("webpack");

/**
 * @param {string} file a JavaScript file
 * @returns {string} the program's output
 */
function run(file) {
	return execFileSync(process.execPath, [file], { encoding: "utf8" }).trim();
}

/**
 * @param {boolean} minimize whether to minify the production build
 * @returns {Promise<string>} the output file
 */
function build(minimize) {
	const outputPath = path.resolve(__dirname, "dist", minimize ? "minified" : "unminified");
	return new Promise((resolve, reject) => {
		webpack({
			context: __dirname,
			mode: "production",
			entry: "./src/index.js",
			optimization: { minimize },
			output: { path: outputPath, filename: "main.js" }
		}, (error, stats) => {
			if (error) return reject(error);
			if (stats.hasErrors()) return reject(new Error(stats.toString({ all: false, errors: true })));
			resolve(path.join(outputPath, "main.js"));
		});
	});
}

(async () => {
	console.log("webpack commit: d9165100217b0038c0d1dae6c38223fee66d54eb");
	const sourceOutput = run(path.resolve(__dirname, "src/index.js"));
	const unminified = await build(false);
	const minified = await build(true);
	const unminifiedOutput = run(unminified);
	const minifiedOutput = run(minified);
	console.log(`source:                          ${sourceOutput}`);
	console.log(`production, minimize: false:     ${unminifiedOutput}`);
	console.log(`production, default minimizer:   ${minifiedOutput}`);
	assert.equal(sourceOutput, "undefined B");
	assert.equal(unminifiedOutput, sourceOutput);
	console.log("minified bundle:");
	console.log(fs.readFileSync(minified, "utf8"));
	if (minifiedOutput !== sourceOutput) {
		console.log("BUG REPRODUCED: minification changes the output");
	} else {
		console.log("NOT REPRODUCED: the minified output matches the source");
	}
})().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
