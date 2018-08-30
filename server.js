var express = require('express'),
    app = express(),
    port = process.env.port || 3000,
    bodyParser = require("body-parser");

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    var routes = require('./api/routes/routes'); //importing route
    routes(app); //register the route

app.listen(port);
