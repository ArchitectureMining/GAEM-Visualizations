import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";

const config: webpack.Configuration = {
	target: "web",
	externals: {
		"neo4j-driver": "neo4j-driver",
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
		path: path.resolve(__dirname, "dist")
	},
	plugins: [
		/*new HtmlWebpackPlugin({
			title: "GAEM Visualizations",
			filename: "./index.html"
		})*/
		new CopyWebpackPlugin([
			{
				from: "./src/index.html"
			},
			{
				from: "./src/lib/",
				to: "./lib/"
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
	},
	/*node: {
		fs: "empty",
		dns: "empty",
		net: "empty",
		readline: "empty",
		tls: "empty"
	}*/
};

export default config;
