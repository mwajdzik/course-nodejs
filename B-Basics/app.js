const http = require('http');
const routes = require('./routes');

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

const server = http.createServer(routes);
server.listen(3000);
