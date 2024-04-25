var port = process.env.PORT || 3000;

http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	if (req.url == "/") {
		//create the form
		res.write("<form method = 'get' action = '/process'><input type = 'text' name = 'search' id = 'search' /><br />Search By: <br /><input type = 'radio' name = 'choices' id = 'ticker' value = 'ticker' /><label for = 'ticker'>Stock Ticker Symbol</label><input type = 'radio' name = 'choices' id = 'company' value = 'company' /><label for = 'company'>Company Name</label><br /><input type = 'submit' value = 'Submit' /></form>");
	} else if ((req.url).includes("/process")) { //have to use includes because has a query string, not necessarily equal
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
