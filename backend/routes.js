var express = require('express');
var router = express.Router();

const request = require('request');
const auth_key = require('./authkey');

// The calculated averages for the various demographics
var calculated_averages = [];

// A list of all occupations represented
var occupation_list = [];

// Recalculates all the averages in calculated_averages
function recalculate_averages() {
    calculated_averages = [];

    var total = 0;
    var n = 0;
    
    return calculated_averages;
}

// Gets the average from calculated_averages according
// to the dictionary <filters>
function get_average(filters) {
    return 0;
}

router.get('/stats', function(req, res, next) {
    // 
    console.log(req.query);

    if (Object.keys(req.query).length == 0) {
	// Invalid request
	console.log("Bad request");
	res.sendStatus(400);
    }

    var filters = {};
    filters.gender = req.query.gender;
    filters.occupation = req.query.occupation;

    var filtered_average = get_average(filters);

    if (filtered_average == null) {
	// Invalid filter
	console.log("Bad request, invalid filter");
	res.sendStatus(400);
    } else {
	res.status(200).send(filtered_average.toString());
    }
    
});

router.get('/customers/:customerId', function(req, res, next) {
    // TODO: Update this later
    res.sendStatus(404);
});

router.get('/customers/:customerId/spending/:category', function(req, res, next) {
    // Calculates the overall spending done by the customer in a certain category

    // Request options
    var opt = {
	url: "https://dev.botsfinancial.com/api/customers/" + req.params.customerId + "/transactions",
	headers: {
	    'Authorization': auth_key
	}
    };

    
    request(opt, function(error, response, body) {
	// Response will be a list of the customer's transactions
	// We then calculate the debits and credits
	var debits = 0;
	var credits = 0;
	var net_change = 0;
	var parsed_body = JSON.parse(response.body);

	for (var i = 0; i < parsed_body.result.length; i++) {
	    var transaction = parsed_body.result[i];

	    if (transaction.categoryTags.includes(req.params.category)) {
		// If the category tag is included

	    
		var transaction_amount = transaction.currencyAmount;
		if (transaction_amount < 0) {
		    credits = credits + (-1 * transaction_amount);
		} else {
		    debits = debits + transaction_amount;
		}
	    }
	}
	
	net_change = debits - credits;

	res.send({'result': {'debits': debits,
			     'credits': credits,
			     'net': net_change},
		  "errorDetails" : null,
		  "errorMsg": null});
    });
});

router.get('/customers/:customerId/spending/:category/withinDays/:days', function(req, res, next) {
    // Calculates the spending done by the customer in a certain category within the past <days> number of days

    // Request options
    var opt = {
	url: "https://dev.botsfinancial.com/api/customers/" + req.params.customerId + "/transactions",
	headers: {
	    'Authorization': auth_key
	}
    };

    
    request(opt, function(error, response, body) {
	// Response will be a list of the customer's transactions
	// We then calculate the debits and credits
	var debits = 0;
	var credits = 0;
	var net_change = 0;
	var parsed_body = JSON.parse(response.body);

	var now_date = new Date();
	
	for (var i = 0; i < parsed_body.result.length; i++) {
	    var transaction = parsed_body.result[i];
	    

	    if (transaction.categoryTags.includes(req.params.category)) {
		// If the category tag is included

		// Filter for dates
		// TODO: This specific conversion isn't working
		var transaction_date = Date.parse(transaction.originationDate);

		var date_difference = now_date - transaction_date;
		date_difference = date_difference / (1000 * 60 * 60 * 24); // Get the difference in actual days

		// TODO: Absolute value of the date for future transactions?
		console.log(date_difference);

		if (date_difference > req.params.withinDays && date_difference > 0) {
		    // Date is more than <days> days ago
		    continue;
		}
		
		var transaction_amount = transaction.currencyAmount;
		if (transaction_amount < 0) {
		    credits = credits + (-1 * transaction_amount);
		} else {
		    debits = debits + transaction_amount;
		}
	    }
	}
	
	net_change = debits - credits;

	res.send({'result': {'debits': debits,
			     'credits': credits,
			     'net': net_change},
		  "errorDetails" : null,
		  "errorMsg": null});
    });
});


router.get('/customers/:customerId/limits/:category', function(req, res, next) {
    // Returns the spending limits per category for the customer
});

router.post('/customers/:customerId/limits/:category', function(req, res, next) {
    // Updates/sets the spending limit for the customer for a certain category
});

router.get('/', function(req, res, next) {
    res.status(200).send(calculated_averages);
});

module.exports = router;

recalculate_averages();
