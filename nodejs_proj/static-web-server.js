var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    port = 8080;
    
var requestListener = function(request, response){
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd() + uri);
        
    path.exists(filename, function(exists){
        if(!exists){
            response.writeHead(404, {'Content-Type':'text/plain'});
            response.write('404 Not Found! \n');
            response.end();
            return;
        }
        
        if(fs.statSync(filename).isDirectory()){
            filename += '/index.html';
            
        }
        
        fs.readFile(filename, 'binary', function(err, file){
            if(err){
                response.writeHead(500, {'Content-Type':'text/plain'});
                response.write(err + '\n');
                response.end();
                return;                
            }

            response.writeHead(200);
            response.write(file, 'binary');
            //response.writeHead(200, {'Content-Type':'text/html'});
            //response.write(file);
            response.end();
        });
        
    });
};


var server = http.createServer(requestListener);
server.listen(port);

console.log('Static file server running at: \n => http://localhost:' + port + '\nCTRL + C to shutdown\n');
