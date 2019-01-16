
var path         = require('path');
var express      = require('express');
var exphbs       = require('express-handlebars');
var serveIndex   = require('serve-index');

//var React        = require('react');
//var ReactDOM     = require('react-dom/server');
//import { match, RouterContext } from 'react-router';
//var routes       = require('../src/js/components/Routes.jsx');
  
var app = express();

var handleBarsInstance = exphbs.create({
  defaultLayout: 'default',
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials'),
  extname: '.hbs'
});

app.set('views', path.join(__dirname, '/views'));
app.engine('hbs', handleBarsInstance.engine);
app.set('view engine', 'hbs');

app.use('/shared', serveIndex(path.join(__dirname + '/../dist/shared/')));

//app.use('/', express.static(path.join(__dirname + '/../client/')));
app.use(express.static(path.join(__dirname + '/../dist/')));
app.use(express.static(path.join(__dirname + '/data/work/uploads/')));


var port = 80;

var server = app.listen(port, () => {
  var serverPort = server.address().port;
  console.log('Server running on port ' + serverPort);
});

app.get('*', function(req, res, next) {
  res.render('index');
});

// Add the endpoint and call the onRequest method when a request is made

/*
app.get('*', function(req, res, next) {
  match({ routes: routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      console.log("Server rendering route", req.path);
      var reactHtml = ReactDOM.renderToString(<RouterContext {...renderProps} />); // renders App Shell + Component

      res.render('index', { html: reactHtml });
    } else {
      res.status(404).send('Not found')
    }
  })
});
*/