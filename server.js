var app = require('./server-config.js');

console.log(process.env);

// var port = 4568;
var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);
