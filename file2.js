const MongoClient = require('mongodb').MongoClient;
const connStr = "mongodb+srv://racheldakermanji:iuGimtV9NHbEAiNB@cluster0.dxi5iab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const http = require('http');
const url = require('url');
var port = process.env.PORT || 3000;
http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	path = req.url;
	if (path  == "/") {
		console.log('here');
		res.write('<form method="get" action="process.js"><label for="radio1">What kind of search?</label><input type="radio" name="rad" value="ticker">Ticker </input><input type="radio" name="rad" value="name">Company Name </input><br><br><label for="str1">Enter a ticker symbol or company name:&nbsp;&nbsp;</label><input type="text" name="inp"></input><br><br><input id="submit" type="submit" value="Submit"></form>');
	} else if ((path).includes("/process")) { 
		console.log('here2');
		const querystring = url.parse(req.url, true).query;
		const radiobuttonvalue = querystring.choices;

		if (radiobuttonvalue == 'ticker') {
			const searchterm = querystring.search;

			MongoClient.connect(connStr, async function(err, db) {
				if (err) {
					return console.log(err);
				}

				var dbo = db.db("Stock");
				var collection = dbo.collection("PublicCompanies");

				var theQuery = {Ticker: searchterm};
				//have to await the search in the data base 
				await collection.find(theQuery).toArray(function(err, items) {
					if (err) {
						console.log(err);
					} else {
						//ticker has potentially many matches 
						for (i = 0; i < items.length; i++) {
							console.log(items[i].Company + ", " + items[i].Ticker + ", " + items[i].Price);
						}
					}
				});
				db.close();
			});
		} else {
			const searchterm = querystring.search;
			MongoClient.connect(connStr, async function(err, db) {
				if (err) {
					return console.log(err);
				}
				
				var dbo = db.db("Stock");
				var collection = dbo.collection("PublicCompanies");

				var theQuery = {Company: searchterm};
				await collection.find(theQuery).toArray(function(err, items) {
					if (err) {
						console.log(err);
					} else {
						//only one possible item for company according to spec 
						console.log(items[0].Company + ", " + items[0].Ticker + ", " + items[0].Price);
					}
				});
				db.close();
			});
		}
	}
	res.end();
}).listen(port); //listen on port for changes; initially did 8080 for testing
