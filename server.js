var express = require('express'),
    app = express(),
    port = process.env.port || 8080,
    bodyParser = require("body-parser");
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    var routes = require('./api/routes/routes'); //importing route
    routes(app); //register the route

app.listen(port);
