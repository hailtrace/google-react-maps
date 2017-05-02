var webpack = require('webpack');

var app = ['./main.js'];
var plugins = [];
var presets = ['react','es2015'];
var config;

if(process.env.NODE_ENV != 'production') {

	plugins = [
	new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
	];

	presets.push('react-hmre');
}

plugins.push(new webpack.DefinePlugin({
    'process.env': {
      // This has effect on the react lib size
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
}));

var config = {
	devtool: 'inline-source-map',
	entry : {
		app : app
	},
	plugins : plugins,
	output: {
		path : require('path').resolve('./dist') ,
		library : '[name]',
		filename : '[name].bundle.js',
		publicPath : '/dist'
	},
	devServer: {
		port: 8082,
		inline: true,
		contentBase: './'
	},
	module: {
		plugins : ["transform-class-properties"],
		loaders : [
			{
				test : /\.css$/,
				loader: 'css-loader'
			},
			{
				test : /(\.js|\.jsx)/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query : {
					presets : presets
				}
			}
		]
	}
}

if(process.env.NODE_ENV == 'production') {
	config.devtool = 'cheap-source-map';
	config.plugins = plugins.concat([
		new webpack.optimize.UglifyJsPlugin({compress:{warnings : false}}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin()
	]);
}




module.exports = config
