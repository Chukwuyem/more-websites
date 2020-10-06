var month_data = [
	{text: "January", value: "January"},
	{text: "February", value: "February"},
	{text: "March", value: "March"},
	{text: "April", value: "April"},
	{text: "May", value: "May"},
	{text: "June", value: "June"},
	{text: "July", value: "July"},
	{text: "August", value: "August"},
	{text: "September", value: "September"},
	{text: "October", value: "October"},
	{text: "November", value: "November"},
	{text: "December", value: "December"}
];
var year_data = [
	{text: "1997", value: 1997},
	{text: "1998", value: 1998},
	{text: "1999", value: 1999},
	{text: "2000", value: 2000},
	{text: "2001", value: 2001},
	{text: "2002", value: 2002},
	{text: "2003", value: 2003},
	{text: "2004", value: 2004},
	{text: "2005", value: 2005},
	{text: "2006", value: 2006},
	{text: "2007", value: 2007},
	{text: "2008", value: 2008},
	{text: "2009", value: 2009},
	{text: "2010", value: 2010},
	{text: "2011", value: 2011},
	{text: "2012", value: 2012},
	{text: "2013", value: 2013},
	{text: "2014", value: 2014},
	{text: "2015", value: 2015}
];
var array_of_events = [];
var newMarker;

var interactions = { "10" : "SOLE MILITARY ACTION", "11" : "MILITARY VERSUS MILITARY", "12" : "MILITARY VERSUS REBELS", "13" : "MILITARY VERSUS POLITICAL MILITIA", "14" : "MILITARY VERSUS COMMUNAL MILITIA", "15" : "MILITARY VERSUS RIOTERS", "16" : "MILITARY VERSUS PROTESTERS", "17" : "MILITARY VERSUS CIVILIANS", "18" : "MILITARY VERSUS OTHER", "20" : "SOLE REBEL ACTION (e.g. base establishment)", "22" : "REBELS VERSUS REBELS", "23" : "REBELS VERSUS POLITICAL MILIITA", "24" : "REBELS VERSUS COMMUNAL MILITIA", "25" : "REBELS VERSUS RIOTERS", "26" : "REBELS VERSUS PROTESTERS", "27" : "REBELS VERSUS CIVILIANS", "28" : "REBELS VERSUS OTHERS", "30" : "SOLE POLITICAL MILITIA ACTION", "33" : "POLITICAL MILITIA VERSUS POLITICAL MILITIA", "34" : "POLITICAL MILITIA VERSUS COMMUNAL MILITIA", "35" : "POLITICAL MILITIA VERSUS RIOTERS", "36" : "POLITICAL MILITIA VERSUS PROTESTERS", "37" : "POLITICAL MILITIA VERSUS CIVILIANS", "38" : "POLITICAL MILITIA VERSUS OTHERS", "40" : "SOLE COMMUNAL MILITIA ACTION", "44" : "COMMUNAL MILITIA VERSUS COMMUNAL MILITIA", "45" : "COMMUNAL MILITIA VERSUS RIOTERS", "46" : "COMMUNAL MILITIA VERSUS PROTESTERS", "47" : "COMMUNAL MILITIA VERSUS CIVILIANS", "48" : "COMMUNAL MILITIA VERSUS OTHER", "50" : "SOLE RIOTER ACTION", "55" : "RIOTERS VERSUS RIOTERS", "56" : "RIOTERS VERSUS PROTESTERS", "57" : "RIOTERS VERSUS CIVILIANS", "58" : "RIOTERS VERSUS OTHERS", "60" : "SOLE PROTESTER ACTION", "66" : "PROTESTERS VERSUS PROTESTERS", "67" : "PROTESTERS VERSUS CIVILIANS", "68" : "PROTESTERS VERSUS OTHER", "78" : "OTHER ACTOR VERSUS CIVILIANS", "80" : "SOLE OTHER ACTION" };

function periodMenu(){
	$("#menu-select").empty();
	jQuery('<select/>', { name:"month" }).appendTo("#menu-select");
	jQuery('<select/>', { name:"year" }).appendTo("#menu-select");
	var month_select = $("[name=month]");
	$.each(month_data, function(){
		month_select.append($("<option/>").val(this.value).text(this.text));
	});
	var year_select = $("[name=year]");
	$.each(year_data, function(){
		year_select.append($("<option/>").val(this.value).text(this.text));
	});
	jQuery('<button/>', { id:"theDateButton", type:"submit", text:"Enter" }).appendTo("#menu-select");
	$("#theDateButton").click(function(){
		console.log("clicked date button!!");

		$("#event_details").empty();
		jQuery('<p/>', {text:"Loading data..."}).appendTo("#event_details");

		//referencing by name attribute instead of id
		var month = $("[name=month]").val().toString(); 
		var year = $("[name=year]").val().toString();
		console.log(month, year);
		getEventsPeriod(month, year);

	});

}

function  fatalitiesMenu(){
	$("#menu-select").empty();
	jQuery('<div/>', {id:"slider-range"}).appendTo("#menu-select");
	jQuery('<input/>', {type:"number", id:"minFatal"}).appendTo("#menu-select");
	jQuery('<input/>', {type:"number", id:"maxFatal"}).appendTo("#menu-select");
	jQuery('<button/>', {id:"theFatalButton", type:"submit", text:"Enter"}).appendTo("#menu-select");

	$("#theFatalButton").click(function(){
		console.log("clicked the fatalities button");

		var minNum = $("#minFatal").val();
		var maxNum = $("#maxFatal").val();

		if (minNum == "") {minNum = "-1"};
		if (maxNum == "") {maxNum = "-1"};

		console.log([typeof minNum, minNum]);
		console.log([typeof maxNum, maxNum]);

		getEventsFatalities(minNum, maxNum);
	});
}

function eventTypeMenu(){
	var vals = Object.keys(interactions).map(function(key) { return interactions[key];});
	$("#menu-select").empty();
	jQuery('<select/>', {name:"eventType"}).appendTo("#menu-select");
	var evType_select = $("[name=eventType]");
	$.each(Object.keys(interactions), function(){
		evType_select.append($("<option/>").text(interactions[this]).val(this));
	});
	jQuery('<button/>', { id:"theEventTypeButton", type:"submit", text:"Enter" }).appendTo("#menu-select");
	$("#theEventTypeButton").click(function(){
		console.log("clicked event type button!!");

		$("#event_details").empty();
		jQuery('<p/>', {text:"Loading data..."}).appendTo("#event_details");

		var interCode = $("[name=eventType]").val();
		var inter = interactions[interCode];
		console.log(interCode);
		console.log(inter);
		getEventsType(interCode);

	});

	//console.log(vals);
}

function eachEvent(event_id, event_date, event_type, actor1, actor2, interaction, location_, latitude, longitude, source_, notes, fatalities){
	this.event_id = event_id;
	this.event_date = event_date;
	this.event_type = event_type;
	this.actor1 = actor1;
	this.actor2 = actor2;
	this.interaction = interactions[interaction];
	this.location_ = location_;
	this.latitude = latitude;
	this.longitude = longitude;
	this.source_ = source_;
	this.notes = notes;
	this.fatalities = fatalities;
}


function getEventsPeriod(month, year){
	var dateURL = "/events-period/"+year+"/"+month;
	console.log(dateURL);
	$.ajax({
		url: dateURL,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			console.log("it's an error from me bro");
		},
		success: function(data){
			console.log("We have data");
			console.log(data); //this is an array
			array_of_events = [];
			for (var i = 0; i < data.length; i++) {
				array_of_events[i] = new eachEvent(data[i]._id, data[i].EVENT_DATE, data[i].EVENT_TYPE, data[i].ACTOR1, data[i].ACTOR2, data[i].INTERACTION, data[i].LOCATION, data[i].LATITUDE, data[i].LONGITUDE, data[i].SOURCE, data[i].NOTES, data[i].FATALITIES);
			};

			initialize(9.07, 7.40);
		}
	});

}

function getEventsFatalities(min, max){
	var fatalURL = "/events-fatalities/"+min+"/"+max;
	console.log(fatalURL);
	$.ajax({
		url: fatalURL,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			console.log("it's an error from me bro");
		},
		success: function(data){
			console.log("We have data");
			console.log(data); //this is an array
			array_of_events = [];
			for (var i = 0; i < data.length; i++) {
				array_of_events[i] = new eachEvent(data[i]._id, data[i].EVENT_DATE, data[i].EVENT_TYPE, data[i].ACTOR1, data[i].ACTOR2, data[i].INTERACTION, data[i].LOCATION, data[i].LATITUDE, data[i].LONGITUDE, data[i].SOURCE, data[i].NOTES, data[i].FATALITIES);
			};

			initialize(9.07, 7.40);
		}
	});
}

function getEventsType(code){
	var eventTypeURL = "/events-type/"+code;
	console.log(eventTypeURL);
	$.ajax({
		url: eventTypeURL,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			console.log("it's an error from me bro");
		},
		success: function(data){
			console.log("We have data");
			console.log(data); //this is an array
			array_of_events = [];
			for (var i = 0; i < data.length; i++) {
				array_of_events[i] = new eachEvent(data[i]._id, data[i].EVENT_DATE, data[i].EVENT_TYPE, data[i].ACTOR1, data[i].ACTOR2, data[i].INTERACTION, data[i].LOCATION, data[i].LATITUDE, data[i].LONGITUDE, data[i].SOURCE, data[i].NOTES, data[i].FATALITIES);
			};

			initialize(9.07, 7.40);
		}
	});
}

function initialize(Lat, Lng){
	var myLatLng = new google.maps.LatLng(Lat, Lng);
	var mapOptions = {
		center: myLatLng,
		zoom: 6,
		minZoom: 6, 
		maxZoom: 10
	};

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	//LatLngBounds (SW corner, NE corner)
	// 15 deg N (+), 15.5 deg E (+) ==NE
	// 3 deg N (+), 2 deg E (+)	==SW

	var allowedBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(3, 2),
		new google.maps.LatLng(14, 15)
	);

	google.maps.event.addListener(map, 'center_changed', function() {
	    if (allowedBounds.contains(map.getCenter())) {
	        // still within valid bounds, so save the last valid position
	        return; 
	    }

	    // not valid anymore => return to last valid position
	     var c = map.getCenter(),
	         x = c.lng(),
	         y = c.lat(),
	         maxX = allowedBounds.getNorthEast().lng(),
	         maxY = allowedBounds.getNorthEast().lat(),
	         minX = allowedBounds.getSouthWest().lng(),
	         minY = allowedBounds.getSouthWest().lat();

	     if (x < minX) x = minX;
	     if (x > maxX) x = maxX;
	     if (y < minY) y = minY;
	     if (y > maxY) y = maxY;

	     //map.setCenter(new google.maps.LatLng(y, x));
	     map.panTo(new google.maps.LatLng(y, x));
	});

	//Limit the zoom level

	//markers
	if (array_of_events.length > 0){
		for (var i = 0; i < array_of_events.length; i++) {
			var pinPos = new google.maps.LatLng(array_of_events[i].latitude, array_of_events[i].longitude);

			newMarker = new google.maps.Marker({
				position: pinPos,
				map: map,
				title: array_of_events[i].location_
			});

			bindClick(array_of_events[i], newMarker);
		};
		$("#event_details").empty();
		jQuery('<p/>', {text:"Data Loaded! You can click the markers on the map. (Yes, really!)"}).appendTo("#event_details");
	}

}

function bindClick(theEvent, theMarker){
	google.maps.event.addListener(theMarker, 'click', function(){
		console.log(theEvent);
		loadEventData(theEvent);
	});
}

function loadEventData(anEvent){
	$("#event_details").empty();

	//loading event
	var detailsStr = "<p>";
	detailsStr += "This conflict event occurred on <span>" + anEvent.event_date + "</span><br>";
	detailsStr += "Event type description: <span>"+ anEvent.event_type + "</span><br>";


	if (anEvent.actor2 === undefined){
		detailsStr += "The <span>" + anEvent.actor1 + "</span> was the only party involved <br>";
	}
	else {
		detailsStr += "It involved <span>"+ anEvent.actor1 + "</span> and <span>" + anEvent.actor2 + "</span><br>";
	}
	
	detailsStr += "Type of interaction: <span>"+ anEvent.interaction + "</span><br>";
	detailsStr += "Event location: <span>"+ anEvent.location_ + "</span><br>";
	detailsStr += "Source of event report: <span>"+ anEvent.source_ + "</span><br>";
	detailsStr += "Short description: "+ anEvent.notes + "<br>";
	detailsStr += "Number of fatalities: "+ anEvent.fatalities + "<br>";
	detailsStr += "</p>"
	$("#event_details").append(detailsStr);

	//setting up comment section
	jQuery('<textarea/>', {id:"event_comment_input", cols:45, type:"text", placeholder:"Enter comment..."}).appendTo("#event_details");
	jQuery('<button/>', {id:"event_comment_button", type:"submit", text:"Comment"}).appendTo("#event_details");

	jQuery('<h3/>', {text:"COMMENTS"}).appendTo("#event_details");
	jQuery('<div/>', {id:"comment_section"}).appendTo("#event_details");

	$("#event_comment_button").click(function(){
		//saving the comment
		var comment = $("#event_comment_input").val(); console.log(comment);
		
		var timestamp = + new Date(); console.log(timestamp);

		theCommentObj = { cmnt_event: anEvent.event_id, cmnt_txt: comment, cmnt_timestamp: timestamp};
		console.log(theCommentObj);
		
		saveComment(theCommentObj);
		
	});

	//loading previous comments
	loadEventComments(anEvent.event_id);
}

function loadEventComments(eventId) {
	var eventCommentURL = "/event-comments/"+eventId;
	console.log(eventCommentURL);
	$.ajax({
		url: eventCommentURL,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			console.log("it's an error from me bro");
		},
		success: function(data){
			console.log("We have data");
			console.log(data);

			
			for (var i = 0; i < data.length; i++) {
				jQuery('<p/>', {id:"event_comment", text:data[i].cmnt_txt}).appendTo("#comment_section");
			};
			//jQuery('<div/>', {class:"clear", style:"display:block;"}).appendTo("#event_details");
		}
	});
}

function saveComment(obj){
	$.ajax({
		url: "/save-event-comment",
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(obj),
		error: function(resp){
			console.log("Oh no...");
			console.log(resp);
		},
		success: function(resp){
			console.log("Comment successfully saved");
			console.log(resp);
			$("#event_comment_input").val("");
			jQuery('<p/>', {id:"event_comment", text:obj.cmnt_txt}).appendTo("#comment_section");
		}
	});
}

$(document).ready(function(){
	console.log("We are ready!");
	periodMenu();

	$("#period").click(function(){
		periodMenu();
	});

	$("#fatalities").click(function(){
		fatalitiesMenu();
	});

	$("#event-type").click(function(){
		eventTypeMenu();
	});

	

	// 9.0765° N, 7.3986° E
	initialize(9.07, 7.40);

});