// const webpack = require('webpack');
// const WebpackDevServer = require('webpack-dev-server');
// const config = require('./webpack.config.babel');

// var port = 8000;

// new WebpackDevServer(webpack(config), {
//   publicPath: config.output.publicPath,
//   hot: true,
//   historyApiFallback: true
// }).listen(port, 'localhost', (err) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log('Listening at localhost:' + port);
// });

var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config.babel');

//config.entry.unshift("webpack-dev-server/client?http://localhost:8080/");

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
  // quiet: true,
  // noInfo: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static('src/assets'));

app.get('/assets/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'src/assets/' + req.params[0]));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:8000/');
});
