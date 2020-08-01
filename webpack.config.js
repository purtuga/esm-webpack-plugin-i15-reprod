const { resolve } = require('path');
const cors = require('cors');
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');

/* This odd way of including the host (in dev mode only)
 * makes sure the dev server serves its own chunks even
 * the app runs on another host. */
const publicPath = 'http://localhost:3000/';
const before = app => app.use(cors({ origin: true, credentials: true }));

module.exports = {
	devServer: {
		hot: true, // Will cause the issue -> the extra HMR webpack module confuses the esm-webpack-plugin to add extra default exports
		port: 3000,
		publicPath,
		before,
	},
	entry: {
		index: './src/index.js',
	},
	output: {
		path: resolve(__dirname, './dist'),
		publicPath,
		filename: '[name].js',
		chunkFilename: '[name].bundle-[hash].js',
		library: 'examplePackage',
		libraryTarget: 'var',
	},
	node: false,
	plugins: [
		new EsmWebpackPlugin({
			exclude(fileName) {
				// Exclude if:
				//	a. not a js file (this is already done by the default `exclude`,
				//	   but since we are using a custom one, need to do the check
				//  b. is a devServer.hot file
				return !/\.[cm]?js$/i.test(fileName) ||
					/\.hot-update\.js$/i.test(fileName);
			}
		}),
	],
	mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
};

