const MongoClient = require('mongodb').MongoClient;
const http = require('http');

const connStr = 'mongodb+srv://racheldakermanji:iuGimtV9NHbEAiNB@cluster0.dxi5iab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

http.createServer(async function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    MongoClient.connect(connStr, async function(err, db) {
        if (err) {
            res.write('Error connecting to the database');
            res.end();
            return;
        }
        var dbo = db.db("Stocks");
	    var collection = dbo.collection("PublicCompanies");
        
        // Here you can perform operations on the database
        
        res.write('Connected to the database');
        res.end();
    });
}).listen(8080);

console.log('Server running at http://localhost:8080/');
