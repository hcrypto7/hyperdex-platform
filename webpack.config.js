'use strict';
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
	src: path.join(__dirname, 'app/renderer'),
	dist: path.join(__dirname, 'app/renderer-dist'),
};

module.exports = (env, options) => ({
	mode: 'development',
	entry: './app/renderer',
	output: {
		path: PATHS.dist,
		filename: 'bundle.js',
	},
	target: 'electron-renderer',
	devtool: options.mode === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
	devServer: {
		historyApiFallback: true,
		overlay: true,
		logLevel: 'warn',
		clientLogLevel: 'warning',
	},
	optimization: {
		minimize: false,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				// Workaround for https://github.com/babel/babel/issues/7788
				options: require('./package.json').babel,
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'sass-loader',
					},
				],
			},
			{
				test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
				exclude: /node_modules/,
				loader: 'file-loader',
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin([PATHS.dist], {verbose: false}),
		new CopyPlugin([
			{
				context: 'app/renderer',
				from: '**/*',
				ignore: ['*.{js,css,scss}'],
			},
			{
				context: 'node_modules/cryptocurrency-icons/svg/color',
				from: '*.svg',
				to: 'assets/cryptocurrency-icons',
			},
		]),
	],
});
