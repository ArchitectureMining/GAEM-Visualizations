import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";

const config: webpack.Configuration = {
	target: "web",
	externals: {
		"neo4j-driver": "neo4j",
		"d3": "d3"
	},
	entry: "./src/app.ts",
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: path.resolve(__dirname, "node_modules")
			}
		]
	},
	output: {
		filename: "./app.js",
		library: "GAEMViews",
		libraryTarget: "var",
		path: path.resolve(__dirname, "dist")
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: "./src/index.html"
			},
			{
				from: "./src/FocusView.html"
			},
			{
				from: "./src/TriView.html"
			},
			{
				from: "./src/css/",
				to: "./css/"
			},
			{
				from: "./src/js/",
				to: "./js/"
			}
		])
	],
	resolve: {
		extensions: [
			".ts",
			".tsx",
			".js"
		],
		modules: [
			"./node_modules/"
		]
	}
};

export default config;
