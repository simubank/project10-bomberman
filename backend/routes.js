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

	    if (parsed_body.result[i].categoryTags.includes(req.params.category)) {
		// If the category tag is included

	    
		var transaction_amount = parsed_body.result[i].currencyAmount;
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

router.get('/', function(req, res, next) {
    res.status(200).send(calculated_averages);
});

module.exports = router;

recalculate_averages();
