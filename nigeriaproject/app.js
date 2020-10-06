//Set up requirements
var express = require("express");
var logger = require('morgan');
var Request = require('request');
var bodyParser = require('body-parser');

//Create an 'express' object
var app = express();

//Some Middleware - log requests to the terminal console
app.use(logger('dev'));

//Set up the views directory
app.set("views", __dirname + '/views');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to the public folder for css & js files
app.use(express.static(__dirname + '/public'));

// Enable json body parsing of application/json
app.use(bodyParser.json());
/*---------------
//DATABASE CONFIG
----------------*/
var cloudant_USER = 'chuksy';
var cloudant_DB = 'nigeria_project_events';
var cloudant_KEY = 'rnoompownyuelivstraither';
var cloudant_PASSWORD = 'e3d648c8a92de18653fa1c9df59e15a9604f9e7d';

var cloudant_URL = "https://" + cloudant_USER + ".cloudant.com/" + cloudant_DB;

//event comments database using EVENT_ID_NO_CITY
var cloudant_DB2 = 'nigeria_project_event_comments';
var cloudant_KEY2 = 'singenerecitspurpencestr';
var cloudant_PASSWORD2 = '468bd19cde7bbe531366d37973eba46314a11eb3';

var cloudant_URL2 = "https://" + cloudant_USER + ".cloudant.com/" + cloudant_DB2;

/*-----
ROUTES
-----*/

//Main Page Route - NO data
app.get("/", function(req, res){
	res.render('index');
});

app.get("/about", function(req, res){
	res.render('about');
})

app.get("/discussion", function(req, res){
	res.render('discussion');
});

app.get("/events-type/:typeNum", function(req, res){
	console.log("Ah you want a request");
	var event_type = req.params.typeNum;

	var cloudantquery = {
	  "selector": {
	    "INTERACTION": event_type
	  },
	  "fields": [
	    "_id",
	    "_rev",
		"EVENT_DATE",
		"YEAR",
		"EVENT_TYPE",
		"ACTOR1",
		"ACTOR2",
		"INTERACTION",
		"LOCATION",
		"LATITUDE",
		"LONGITUDE",
		"SOURCE",
		"NOTES",
		"FATALITIES"
	  ],
	  "sort": [
	    {
	      "_id": "asc"
	    }
	  ]
	};

	Request({
		method: 'POST',
		uri: cloudant_URL + "/_find",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true,
		body: cloudantquery
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//res.send(body);
			res.json(body.docs);
		}
		else {
			console.log("something went wrong");
			console.log(response);
		}
	});

});

app.get("/events-fatalities/:smallNum/:bigNum", function(req, res){
	console.log("Ah you want a request");
	var smallNum = parseInt(req.params.smallNum);
	var bigNum = parseInt(req.params.bigNum);

	console.log([smallNum, bigNum]);

	var cloudantquery;
	if (smallNum == -1) {
		cloudantquery = {
		  "selector": {
		    "FATALITIES": {
		    	"$lte": bigNum
		    }
		  },
		  "fields": ["_id", "_rev", "EVENT_DATE", "YEAR", "EVENT_TYPE",  "ACTOR1", "ACTOR2", "INTERACTION", "LOCATION", "LATITUDE", "LONGITUDE", "SOURCE", "NOTES", "FATALITIES"],
		  "sort": [
		    {
		      "FATALITIES": "desc"
		    }
		  ]
		};

	}
	else if (bigNum == -1){
		cloudantquery = {
		  "selector": {
		    "FATALITIES": {
		    	"$gte": smallNum
		    }
		  },
		  "fields": ["_id", "_rev", "EVENT_DATE", "YEAR", "EVENT_TYPE",  "ACTOR1", "ACTOR2", "INTERACTION", "LOCATION", "LATITUDE", "LONGITUDE", "SOURCE", "NOTES", "FATALITIES"],
		  "sort": [
		    {
		      "FATALITIES": "desc"
		    }
		  ]
		};
	}
	else {
		cloudantquery = {

		  "selector": {
		    	"$and": [
		      		{ "FATALITIES": { "$gte": smallNum}},
		    		{"FATALITIES": {"$lte": bigNum}}
		      	]
		  },
		  "fields": ["_id", "_rev", "EVENT_DATE", "YEAR", "EVENT_TYPE",  "ACTOR1", "ACTOR2", "INTERACTION", "LOCATION", "LATITUDE", "LONGITUDE", "SOURCE", "NOTES", "FATALITIES"],
		  "sort": [
		    {
		      "FATALITIES": "desc"
		    }
		  ]
		};
	}

	

	Request({
		method: 'POST',
		uri: cloudant_URL + "/_find",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json:true,
		body: cloudantquery
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.send(body.docs);
		}
		else {
			console.log("something went wrong");
			console.log(response);
		}
	});

});

app.get("/events-period/:year/:month", function(req, res){
	console.log("Ah, so you want a request!");
	var year = parseInt(req.params.year);
	var month = req.params.month;

	var cloudantquery = {
	  "selector": {
	    "MONTH": month,
	    "YEAR" : year
	  },
	  "fields": [
	    "_id",
	    "_rev",
	    "EVENT_DATE",
	    "YEAR",
	    "EVENT_TYPE",
	    "ACTOR1",
	    "ACTOR2",
	    "INTERACTION",
	    "LOCATION",
	    "LATITUDE",
	    "LONGITUDE",
	    "SOURCE",
	    "NOTES",
	    "FATALITIES"
	  ],
	  "sort": [
	    {
	      "_id": "asc"
	    }
	  ]
	};

	Request({
		method: 'POST', //no, GET doesn't work
		uri: cloudant_URL + "/_find",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json:true,
		body: cloudantquery
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body);
			//res.send(body);
			res.json(body.docs);
		}
		else {
			console.log("something went wrong");
			console.log(response);
		}
	});


});

app.get("/event-comments/:eventID", function(req, res){
	console.log("getting comments");
	var event_id = req.params.eventID;

	var cloudantquery = {
		"selector": {
			"cmnt_event": event_id
		},
		"fields": [
			"cmnt_event",
			"cmnt_txt",
			"cmnt_timestamp"
		],
		"sort": [
			{
				"cmnt_timestamp": "desc"
			}
		]
	};

	Request({
		method: "POST",
		uri: cloudant_URL2 + "/_find",
		auth: {
			user: cloudant_KEY2,
			pass: cloudant_PASSWORD2
		},
		json: true,
		body: cloudantquery
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(body.docs);
		}
		else {
			console.log("something went wrong");
			console.log(response);
		}
	});
});


app.post("/save-event-comment", function(req, res){
	console.log("AN EVENT COMMENT");

	var data = req.body;
	console.log(data);

	Request.post({
		url: cloudant_URL2,
		auth: {
			user: cloudant_KEY2,
			pass: cloudant_PASSWORD2
		},
		json: true,
		body: data
	},
	function (error, response, body){
		console.log("This is response");
		console.log(response);

		if (response.statusCode == 201){
			console.log("Saved");
			res.json(body);
		}
		else {
			console.log("Uh oh...");
			console.log("Error: " + res.statusCode);
			res.send("Something went wrong...");
		}
	});

});

//Catch All Route
app.get("*", function(req, res){
	res.send('Sorry, nothing doing here.');
});

// Start the server
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express started on port '+ port);