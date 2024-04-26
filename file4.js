const MongoClient = require('mongodb').MongoClient;
const connStr = "mongodb+srv://racheldakermanji:iuGimtV9NHbEAiNB@cluster0.dxi5iab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const http = require('http');
const url = require('url');
var port = process.env.PORT || 3000;

http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	if (req.url == "/") {
		res.write('<form method="get" action="process.js"><label for="radio1">What kind of search?</label><input type="radio" name="rad" value="ticker">Ticker </input><input type="radio" name="rad" value="name">Company Name </input><br><br><label for="str1">Enter a ticker symbol or company name:&nbsp;&nbsp;</label><input type="text" name="inp"></input><br><br><input id="submit" type="submit" value="Submit"></form>');
	} else if ((req.url).includes("/process")) {
		//res.write("<p>file4.js</p>");
		const processquery = url.parse(req.url, true).query;
		const comportick = processquery.rad;
    
		if (comportick == 'name') {
			const input_search = processquery.inp;
			MongoClient.connect(connStr, function(err, db) {
				//res.write("test in mogno");
				if (err) {
					return console.log(err);
				}

				var dbo = db.db("Stocks");
				var collection = dbo.collection("PublicCompanies");

				var theQuery = {Company: input_search};
				console.log("theQuery");
				console.log(theQuery);
				collection.find(theQuery).toArray(function(err, items) {
					if (err) {
						console.log(err);
					} else {
						for (i = 0; i < items.length; i++) {
							console.log("Company: " + items[i].Company + ", Ticker: " + items[i].Ticker + ", Price: " + items[i].Price);
							res.write("Company: " + items[i].Company + ", Ticker: " + items[i].Ticker + ", Price: " + items[i].Price);
							res.write("<script language=javascript>console.log(Company: " + items[i].Company + ", Ticker: " + items[i].Ticker + ", Price: " + items[i].Price + "); </script>");
						}
					}
					db.close();
				res.end();
				});
				
			});
		} if (comportick == 'ticker') {
			const input_search = processquery.inp;

			MongoClient.connect(connStr, function(err, db) {
				if (err) {
					return console.log(err);
				}

				var dbo = db.db("Stocks");
				var collection = dbo.collection("PublicCompanies");

				var theQuery = {Ticker: input_search};
				console.log("theQuery");
				console.log(theQuery);
				collection.find(theQuery).toArray(function(err, items) {
					if (err) {
						console.log(err);
					} else {
						for (i = 0; i < items.length; i++) {
							console.log("Company: " + items[i].Company + ", Ticker: " + items[i].Ticker + ", Price: " + items[i].Price);
							res.write("Company: " + items[i].Company + ", Ticker: " + items[i].Ticker + ", Price: " + items[i].Price);
						}
					}
					db.close();
				res.end();
				});

			});
		}
	}
	//res.end();	
}).listen(port); 

