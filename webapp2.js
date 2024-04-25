const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://racheldakermanji:iuGimtV9NHbEAiNB@cluster0.dxi5iab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const http = require('http')
var url = require('url');
var qs = require('querystring');


http.createServer(function (req, res) {
  
  if (path == "/")
  {
    res.write('<form method="get" action="/process"><label for="radio1">What kind of search?</label><input type="radio" name="rad" value="ticker">Ticker </input><input type="radio" name="rad" value="name">Company Name </input><br><br><label for="str1">Enter a ticker symbol or company name:&nbsp;&nbsp;</label><input type="text" name="inp"></input><br><br><input id="submit" type="submit" value="Submit"></form>';
    })
  }
  else if (path == "/process")
  {
	res.write ("Processing<br/>");
    var body = '';
    req.on('data', chunk => { body += chunk.toString();  });
    req.on('end', () => 
        { 
        res.write ("Raw data string: " + body +"<br/>");
	    var id = qs.parse(body).id;      // assumes x is post data parameter	
        res.write ("The id is " + id );
        res.end();
        });
  }
}).listen(8080);
