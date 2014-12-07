var http = require("http");
var requestListener = function(request, response){
    response.writeHead(200, {'Content-Type':'text/plain'});
    response.end('Hello - \n');
}
var server = http.createServer(requestListener);
server.listen(8080);
