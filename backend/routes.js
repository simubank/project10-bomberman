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



router.get('/customers/:customerId/spending/category/:category', function(req, res, next) {
    // Calculates the overall spending done by the customer in a certain category for transactions that have already passed

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

	// Filter for dates that have passed
	var now_date = new Date();

	for (var i = 0; i < parsed_body.result.length; i++) {
	    var transaction = parsed_body.result[i];

	    if (transaction.categoryTags.includes(req.params.category)) {
		// If the category tag is included

		// Filter for dates
		var transaction_date = Date.parse(transaction.originationDate);

		var date_difference = now_date - transaction_date;
		date_difference = date_difference / (1000 * 60 * 60 * 24); // Get the difference in actual days

		if (date_difference < 0) {
		    // Transaction has not yet occurred
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
		  "errorMsg": null,
		  "statusCode": 200});
    });
});

router.get('/customers/:customerId/spending/category/:category/withinDays/:days', function(req, res, next) {
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
		var transaction_date = Date.parse(transaction.originationDate);

		var date_difference = now_date - transaction_date;
		date_difference = date_difference / (1000 * 60 * 60 * 24); // Get the difference in actual days

		

		if (date_difference > Number(req.params.days) || date_difference < 0) {
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
		  "errorMsg": null,
		  "statusCode": 200});
    });
});

router.get('/customers/:customerId/spending', function(req, res, next) {
    // Calculates the spending done by the customer

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
	    

	    // Filter for dates
	    var transaction_date = Date.parse(transaction.originationDate);
	    
	    var date_difference = now_date - transaction_date;
	    date_difference = date_difference / (1000 * 60 * 60 * 24); // Get the difference in actual days
	    
	    
	    
	    if (date_difference < 0) {
		// Date hasn't yet passed
		continue;
	    }
	    
	    var transaction_amount = transaction.currencyAmount;
	    if (transaction_amount < 0) {
		credits = credits + (-1 * transaction_amount);
	    } else {
		debits = debits + transaction_amount;
	    }
	}
	
	net_change = debits - credits;

	res.send({'result': {'debits': debits,
			     'credits': credits,
			     'net': net_change},
		  "errorDetails" : null,
		  "errorMsg": null,
		  "statusCode": 200});
    });
});


router.get('/customers/:customerId/spending/withinDays/:days', function(req, res, next) {
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
	    

	    // Filter for dates
	    var transaction_date = Date.parse(transaction.originationDate);
	    
	    var date_difference = now_date - transaction_date;
	    date_difference = date_difference / (1000 * 60 * 60 * 24); // Get the difference in actual days
	    
	    
	    
	    if (date_difference > Number(req.params.days) || date_difference < 0) {
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
	
	net_change = debits - credits;

	res.send({'result': {'debits': debits,
			     'credits': credits,
			     'net': net_change},
		  "errorDetails" : null,
		  "errorMsg": null,
		  "statusCode": 200});
    });
});


router.get('/customers/:customerId/limits/:category', function(req, res, next) {
    // Returns the spending limits per category for the customer

    res.send({'result': [],
	      "errorDetails" : null,
	      "errorMsg": null,
	      "statusCode": 501});
    
});

router.post('/customers/:customerId/limits/:category', function(req, res, next) {
    // Updates/sets the spending limit for the customer for a certain category
    
    res.send({'result': [],
	      "errorDetails" : null,
	      "errorMsg": null,
	      "statusCode": 501});
    
});

router.get('/customers/:customerId/categories', function(req, res, next) {
    // Returns all the categories of transactions by a certain customer for transactions that have passed

    // Request options
    var opt = {
	url: "https://dev.botsfinancial.com/api/customers/" + req.params.customerId + "/transactions",
	headers: {
	    'Authorization': auth_key
	}
    };

    request(opt, function(error, response, body) {
	// Response will be a list of the customer's transactions
	// We then get the unique categories
	var transaction_categories = [];
	var parsed_body = JSON.parse(response.body);

	var now_date = new Date();
	
	for (var i = 0; i < parsed_body.result.length; i++) {
	    var transaction = parsed_body.result[i];
	    
	    for (var j = 0; j < transaction.categoryTags.length; j++) {
		var transaction_category = transaction.categoryTags[j];
		if (!transaction_categories.includes(transaction_category)) {
		    // If the category tag is not yet accounted for
		    
		    // Filter for dates
		    var transaction_date = Date.parse(transaction.originationDate);
		    
		    var date_difference = now_date - transaction_date;
		    date_difference = date_difference / (1000 * 60 * 60 * 24); // Get the difference in actual days
		    
		    
		    if (date_difference < 0) {
			// Date has not passed
			continue;
		    }
		    
		    transaction_categories.push(transaction_category);
		    
		}
	    }
	}

	res.send({'result': transaction_categories,
		  "errorDetails" : null,
		  "errorMsg": null,
		  "statusCode" : 200});
    });
    
});

router.get('/', function(req, res, next) {
    res.send({'result': calculated_averages,
	      "errorDetails" : null,
	      "errorMsg": null,
	      "statusCode": 200});
    
});


router.get('/customers/:customerId/info', function(req, res, next) {
    // Returns info on the customer

    // Request options
    var opt = {
	url: "https://dev.botsfinancial.com/api/customers/" + req.params.customerId,
	headers: {
	    'Authorization': auth_key
	}
    };

    request(opt, function(error, response, body) {
	// Response will be the customers information and transactions
	// the first element of the list will be their personal info
	var parsed_body = JSON.parse(response.body);


	// TODO: Error check to ensure it is a valid id
	
	
	res.send({'result': parsed_body.result[0],
		  "errorDetails" : null,
		  "errorMsg": null,
		  "statusCode" : 200});
    });
    
});


// Simulants API calls
router.get('/customers', function(req, res, next) {
    // Returns all the customers

    // Request options
    var opt = {
	url: "https://dev.botsfinancial.com/api/simulants/",
	headers: {
	    'Authorization': auth_key
	}
    };

    request(opt, function(error, response, body) {
	// Response will be the customers information and transactions
	// the first element of the list will be their personal info
	var parsed_body = JSON.parse(response.body);


	
	res.send({'result': parsed_body.result,
		  "errorDetails" : null,
		  "errorMsg": null,
		  "statusCode" : 200});
    });
    
});

router.get('/customers/transactions', function(req, res, next) {
    // Returns all the transactions

    // All the transactions of all the customers
    var all_transactions = [];

    // Request options
    var opt = {
	url: "https://dev.botsfinancial.com/api/simulants/",
	headers: {
	    'Authorization': auth_key
	}
    };

    request(opt, function(error, response, body) {
	// Response will be the customers information and transactions
	// the first element of the list will be their personal info
	var parsed_body = JSON.parse(response.body);
	
	function getCustomerTransactions(customerId) {
	    // Returns a promise whose value is the list of transactions for customerId
	    var transOpt = {
		url: "https://dev.botsfinancial.com/api/simulants/" + customerId + "/simulatedtransactions",
		headers: {
		    'Authorization': auth_key
		}
	    };
	    
	    return new Promise((resolve, reject) => {
		request(transOpt, function(inerror, inresponse, body) {
		    
		    var parsed_body = JSON.parse(response.body);
		    // TODO: Error check
		    
		    // Set the promise's value to the list of transactions for the customer
		    console.log("A");
		    Promise.resolve(parsed_body.result);
		});
	    });
	}
	
	for (var i = 0; i < parsed_body.result.length; i++) {
	    var customer = parsed_body.result[i];
	    // All the transactions of the customer
	    var customer_transactions = getCustomerTransactions(customer.id).then((result) => {
		console.log(result);
		return result;
	    });
	    console.log(customer_transactions);
	    console.log(customer.id);
	    console.log(customer_transactions.length);
	    console.log("-------");
	    

	    // Add all transactions to the full list of transactions
	    // TODO: Is there a nicer way to do this?
	    for (var j = 0; j < customer_transactions.length; j++) {
		all_transactions.push(customer_transactions[j]);
	    }
	    
	}

	res.send({'result': all_transactions,
		  "errorDetails" : null,
		  "errorMsg": null,
		  "statusCode" : 200});
    }); // End response

});

// Debug follow up routes
router.get('/customers/:customerId', function(req, res, next) {
    // TODO: Update this later
    res.sendStatus(404);
});

// Catch all other requests, return a 404
// DO NOT PUT ANY OTHER ROUTES AFTER THIS POINT
router.get('*', function(req, res, next) {
    res.send({'result': [],
	      "errorDetails" : null,
	      "errorMsg": "Not Found",
	      "statusCode": 404});
});

module.exports = router;

recalculate_averages();
