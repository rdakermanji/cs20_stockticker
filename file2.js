const MongoClient = require('mongodb').MongoClient;
const connStr = "mongodb+srv://racheldakermanji:iuGimtV9NHbEAiNB@cluster0.dxi5iab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const http = require('http');
const url = require('url');
var port = process.env.PORT || 3000;
http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	if (req.url  == "/") {
		console.log('here on the form page');
		res.write('<form method="get" action="process.js"><label for="radio1">What kind of search?</label><input type="radio" name="rad" value="ticker">Ticker </input><input type="radio" name="rad" value="name">Company Name </input><br><br><label for="str1">Enter a ticker symbol or company name:&nbsp;&nbsp;</label><input type="text" name="inp"></input><br><br><input id="submit" type="submit" value="Submit"></form>');
	} else if ((req.url).includes("/process")) { 
		const processquery = url.parse(req.url, true).query;
		//window.alert(querystring)
		const comportick = processquery.rad;

		if (comportick == 'name') {
			const searchinput = processquery.inp;
			MongoClient.connect(connStr, async function(err, db) {
				var dbo = db.db("Stock");
				var collection = dbo.collection("PublicCompanies");

				var theQuery = {Company: searchinput};
				var result = collection.find(theQuery,{Ticker:1, Price:1})
				result.toArray(function(err, items) {
				  if (err) {
					console.log("Error: " + err);
				  } 
				  else 
				  {
					console.log("Companies: ");
					for (i=0; i<items.length; i++)
						console.log("Company Name: "+  items[i].Company + " , Stock Ticker: " + items[i].Ticker + " , Price: " + items[i].Price);			
				  }   
				  db.close();
				}); 		
		}
	}
	res.end();
}).listen(port); 
