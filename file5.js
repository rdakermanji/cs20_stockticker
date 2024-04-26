http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});

	if (req.url == "/") {
		//create the form 
		res.write("<form method = 'get' action = '/process'><input type = 'text' name = 'search' id = 'search' /><br />Search By: <br /><input type = 'radio' name = 'choices' id = 'ticker' value = 'ticker' /><label for = 'ticker'>Stock Ticker Symbol</label><input type = 'radio' name = 'choices' id = 'company' value = 'company' /><label for = 'company'>Company Name</label><br /><input type = 'submit' value = 'Submit' /></form>");
		res.end();
	} else if ((req.url).includes("/process")) {
		const querystring = url.parse(req.url, true).query;
		const radiobuttonvalue = querystring.choices; //get what the radio button says
		const searchterm = querystring.search;

		MongoClient.connect(connStr, function(err, db) {
			if (err) {
				return console.log(err);
			}

			var dbo = db.db("Stock");
			var collection = dbo.collection("PublicCompanies");

			if (radiobuttonvalue == 'ticker') { //different query for company vs. ticker
				var theQuery = {Ticker: searchterm};
			} else {
				var theQuery = {Company: searchterm};
			}

			collection.find(theQuery).toArray(function(err, items) {
				if (err) {
					return console.log(err);
				} 

				items.forEach((item) =>{
					//logging the results for each item 
					console.log(item.Company + ", " + item.Ticker + ", " + item.Price);

					//writing the results for each item
					res.write("" + item.Company + ", " + item.Ticker + ", " + item.Price);
					res.write("<br />");
				});

				db.close();
				res.end(); //need to end the response here when we go to this page 
			});
		});
	}
}).listen(port); //listen on the port
