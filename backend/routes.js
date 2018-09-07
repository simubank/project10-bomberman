
var conf = require('./config');
const PORT = conf['PORT'];

var express = require('express');
var router = express.Router();

const request = require('request');
const auth_key = require('./authkey');

// Get the averages data
var averages;
//var averages = require('./manipulator');

// Get the common functions
var common_functions = require('./comm');
var convert_age = common_functions['convert_age'];

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
	url: "https://botsfinancial.com/api/customers/" + req.params.customerId + "/transactions",
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

	if (parsed_body.statusCode != 200) {
	    // Error in processing
	    res.send(parsed_body);
	    return;
	}

	// Filter for dates that have passed
	var now_date = new Date();

	for (var i = 0; i < parsed_body.result.length; i++) {
		var transaction = parsed_body.result[i];
		
		if (!transaction.categoryTags) continue

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
	url: "https://botsfinancial.com/api/customers/" + req.params.customerId + "/transactions",
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

	if (parsed_body.statusCode != 200) {
	    // Error in processing
	    res.send(parsed_body);
	    return;
	}

	var now_date = new Date();
	
	for (var i = 0; i < parsed_body.result.length; i++) {
	    var transaction = parsed_body.result[i];
	    
		if (!transaction.categoryTags) continue

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
	url: "https://botsfinancial.com/api/customers/" + req.params.customerId + "/transactions",
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

	if (parsed_body.statusCode != 200) {
	    // Error in processing
	    res.send(parsed_body);
	    return;
	}

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
	url: "https://botsfinancial.com/api/customers/" + req.params.customerId + "/transactions",
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

	if (parsed_body.statusCode != 200) {
	    // Error in processing
	    res.send(parsed_body);
	    return;
	}

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

router.get('/customers/:customerId/spending/categories', function(req, res, next) {
    // Returns all the categories of transactions by a certain customer for transactions that have passed

    // Request options
    var opt = {
	url: "https://botsfinancial.com/api/customers/" + req.params.customerId + "/transactions",
	headers: {
	    'Authorization': auth_key
	}
    };

    request(opt, function(error, response, body) {
	// Response will be a list of the customer's transactions
	// We then get the unique categories
	var transaction_categories = [];
	var parsed_body = JSON.parse(response.body);

	if (parsed_body.statusCode != 200) {
	    // Error in processing
	    res.send(parsed_body);
	    return;
	}

	var now_date = new Date();
	
	for (var i = 0; i < parsed_body.result.length; i++) {
		var transaction = parsed_body.result[i];

		if (!transaction.categoryTags) continue
	    
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
    res.send({'result': "Hello, world!",
	      "errorDetails" : null,
	      "errorMsg": null,
	      "statusCode": 200});
    
});


router.get('/customers/:customerId/info', function(req, res, next) {
    // Returns info on the customer

    // Request options
    var opt = {
	url: "https://botsfinancial.com/api/customers/" + req.params.customerId,
	headers: {
	    'Authorization': auth_key
	}
    };

    request(opt, function(error, response, body) {
	// Response will be the customers information and transactions
	// the first element of the list will be their personal info
	var parsed_body = JSON.parse(response.body);


	if (parsed_body.statusCode != 200) {
	    // Error in processing
	    res.send(parsed_body);
	    return;
	}
	
	
	res.send({'result': parsed_body.result[0],
		  "errorDetails" : null,
		  "errorMsg": null,
		  "statusCode" : 200});
    });
    
});


router.post('/cashback/:accountId', function(req, res, next) {

    // Get the amount of money we need
    var parsed_body = JSON.parse(req.body);

    var money_needed = parsed_body.amount;

    // Options for the request to generate money for our cashback
    // account
    var optGenerateMoney = {
	url: "https://botsfinancial.com/api/transfers",
	headers: {
	    'Authorization': auth_key
	},
	body: JSON.stringify({"balance": money_needed})
    };
    
    

    // Request options for the determine what our account # is request
    var optAccountNumber = {
	url: "https://botsfinancial.com/api/transfers",
	headers: {
	    'Authorization': auth_key
	}
    };


    

    request.get(optAccountNumber, function(errorNumber, responseNumber, bodyNumber) {
	var parsed_app_account_number = JSON.parse(responseNumber.body).results.id;

	request.patch(optGenerateMoney, function(errorGenerate, responseGenerate, bodyGenerate) {

	    // Now that we've generated the money, we have to do a transfer
	    
	    // Request options for the transfer request
	    var optTransfer = {
		url: "https://botsfinancial.com/api/transfers",
		headers: {
		    'Authorization': auth_key
		},
		body: JSON.stringify({amount: money_needed,
				      currency: 'CAD',
				      fromAccountID: parsed_app_account_number,
				      receipt: null,
				      toAccountID: req.params.accountId
				     })
	    };

	    request.post(optTransfer, function(errorTransfer, responseTransfer, bodyTransfer) {

		var parsed_bodyTransfer = JSON.parse(bodyTransfer);
		
		if (parsed_bodyTransfer.statusCode != 200) {
		    // Error in processing
		    res.send(parsed_body);
		    return;
		}


	    });
	});
	
    });
    
});


// Simulants API calls
router.get('/customers', function(req, res, next) {
    // Returns all the customers

    // Request options
    var opt = {
	url: "https://botsfinancial.com/api/simulants/",
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


router.get('/transactions', function(req, res, next) {
    // Returns all the transactions

    // All the transactions of all the customers
    var all_transactions = [];

    // A list of promises each representing a list of transactions
    // for each user
    var customer_promises = [];

    // Request options
    var opt = {
	url: "https://botsfinancial.com/api/simulants/",
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
		url: "https://botsfinancial.com/api/simulants/" + customerId + "/simulatedtransactions",
		headers: {
		    'Authorization': auth_key
		}
	    };
	    
	    return new Promise((resolve, reject) => {
		request(transOpt, function(inerror, inresponse, inbody) {

		    if (inresponse == null || inresponse == undefined || inerror != null) {
			resolve([]);
			return;
		    }
		    
		    var inparsed_body = JSON.parse(inresponse.body);
		    
		    // Set the promise's value to the list of transactions for the customer
		    resolve(inparsed_body.result);
		});
	    });
	}
	
	for (var i = 0; i < parsed_body.result.length; i++) {
	    var customer = parsed_body.result[i];
	    
	    // Add the promise representing
	    // all the transactions of the customer
	    customer_promises.push(getCustomerTransactions(customer.id));

	    // Sample mode, comment out for full results (warning, insanely large)
	    if (i == conf['sample_size']) {
		break;
	    }
	    
	}

	// We now wait for all the Promises to finish processing
	// and send them
	Promise.all(customer_promises).then(function(values) {
	    res.send({'result': values,
		      "errorDetails" : null,
		      "errorMsg": null,
		      "statusCode" : 200});
	});

	
    }); // End response

});

router.get('/transactions/withinDays/:days', function(req, res, next) {
    // Returns a sample of the transactions that occurred within <days> days
    // Used to generate the metrics
    request.get('http://localhost:' + PORT.toString() + '/transactions', function(error, response, body) {
	// Response will be an array of arrays, with each sub array
	// representing a customer's transactions
	// We filter for the transactions that occur within the
	// right timeframe
	
	var parsed_body = JSON.parse(response.body);

	if (parsed_body.statusCode != 200) {
	    // Error in processing
	    res.send(parsed_body);
	    return;
	}

	var now_date = new Date();
	var ret_transactions = [];

	for (var i = 0; i < parsed_body.result.length; i++) {
	    // One user's transactions as an array
	    var users_transactions = [];
	    for (var j = 0; j < parsed_body.result[i].length; j++) {
		// Iterate over the user's transactions
		var transaction = parsed_body.result[i][j];

		// Filter for dates

		var transaction_date = Date.parse(transaction.postDate);
		
		var date_difference = now_date - transaction_date;
		date_difference = date_difference / (1000 * 60 * 60 * 24); // Get the difference in actual days
		
		
		
		if (date_difference > Number(req.params.days) || date_difference < 0) {
		    // Date is more than <days> days ago
		    continue;
		}
		
		users_transactions.push(transaction);
		
	    }

	    ret_transactions.push(users_transactions);
	}
	

	res.send({'result': ret_transactions,
		  "errorDetails" : null,
		  "errorMsg": null,
		  "statusCode": 200});
    });
});

// Metrics routes
router.get('/metrics/:category', function(req, res, next) {
    // Check to make sure that all arguments are set right
    if (req.query.gender == null || req.query.age == null ||
	req.query.occupation == null) {
	res.send({'result': [],
		  "errorDetails" : null,
		  "errorMsg": "A parameter (one of age, gender, occupation) was not set",
		  "statusCode": 400});
	return;
    }

    // Number of debits/credits summed, allows us to skip certain
    // categories if we want to if an invalid value is sent in
    var debit_n = 0;
    var credit_n = 0;

    var debits = 0;
    var credits = 0;

    // Used to check that the category exists
    var value_to_add;
    
    // Handle ages
    value_to_add = averages['ages'][convert_age(req.query.age)];
    if (value_to_add == null) {
	res.send({'result': [],
		  "errorDetails" : null,
		  "errorMsg": "Invalid age",
		  "statusCode": 400});
	return;
	
    }

    value_to_add = averages['ages'][convert_age(req.query.age)][req.params.category];

    // value_to_add is now a dict with two keys
    debits = debits + value_to_add['debit_average'];
    credits = credits + value_to_add['credit_average'];
    debit_n = debit_n + 1;
    credit_n = credit_n + 1;
    
    // Handle genders
    value_to_add = averages['genders'][req.query.gender];
    if (value_to_add == null) {
	res.send({'result': [],
		  "errorDetails" : null,
		  "errorMsg": "Invalid gender",
		  "statusCode": 400});
	return;
	
    }

    value_to_add = averages['genders'][req.query.gender][req.params.category];

    // value_to_add is now a dict with two keys
    debits = debits + value_to_add['debit_average'];
    credits = credits + value_to_add['credit_average'];
    debit_n = debit_n + 1;
    credit_n = credit_n + 1;

    // Divide and return
    res.send({'result': {'debit_average' : debits / debit_n,
			 'credit_average' : credits / credit_n


			},
	      "errorDetails" : null,
	      "errorMsg": null,
	      "statusCode": 200});
	

    
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

// To allow us to make a request to the server for data
averages = require('./manipulator');
