// Get the sample data
var sample_data = require('./data');
sample_data = JSON.parse(sample_data);
sample_data = sample_data['result'];

// Get the customer's data
var customers_data = require('./customers');
customers_data = JSON.parse(customers_data);
customers_data = customers_data['result'][0];

var filter_categories = ['Fast food', 'Salary', 'Rent', 'Utility bill', 'eTransfer', 'Tax', 'Insurance', 'Mortgage'];
var categories = {}; // Overall spending per each filter
var ages = {}; // Spending per each filter, age dependant
var genders = {}; // Spending per each filter, gender dependant

// Initialize the categories structure
for (var i = 0; i < filter_categories.length; i++) {
    var category = filter_categories[i];

    categories[category] = {
	'debit_average': 0,
	'credit_average': 0,
	'debit_n': 0,
	'credit_n': 0
    };
}

// Initialize ages structure
for (var i = 0; i < 100; i=i + 5) {
    ages[i.toString()] = {};

    for (var j = 0; j < filter_categories.length; j++) {
	category = filter_categories[j];

	ages[i.toString()][category] = {
	    'debit_average': 0,
	    'credit_average': 0,
	    'debit_n': 0,
	    'credit_n': 0
	};
    }
}

function isDebit(transaction) {
    if (transaction.currencyAmount > 0) {
	return false;
    } else {
	return true;
    }
}

var overall_debit = 0;
var overall_credit = 0;

var overall_debit_n = 0;
var overall_credit_n = 0;
for (var i = 0; i < sample_data.length; i++) {
    var user_array = sample_data[i];
    
    for (var j = 0; j < user_array.length; j++) {
	// Iterate over each transaction for the user
	var transaction = user_array[j];

	if (transaction.type == "CreditCardTransaction") {
	    transaction.currencyAmount = transaction.currencyAmount * -1;
	}

	if (isDebit(transaction)) {
	    overall_debit = overall_debit + transaction.currencyAmount;
	    overall_debit_n = overall_debit_n + 1;
	} else {
	    overall_credit = overall_credit + transaction.currencyAmount;
	    overall_credit_n = overall_credit_n + 1;
	}

	for (var k = 0; k < filter_categories.length; k++) {
	    // Handle the filters
	    category = filter_categories[k];
	    if (transaction.categoryTags.includes(category)) {
		if (isDebit(transaction)) {
		    categories[category]['debit_average'] = categories[category]['debit_average'] + transaction.currencyAmount;
		    categories[category]['debit_n'] = categories[category]['debit_n'] + 1;
		} else {
		    categories[category]['credit_average'] = categories[category]['credit_average'] + transaction.currencyAmount;
		    categories[category]['credit_n'] = categories[category]['credit_n'] + 1;
		}
	    }
	}
    }

}

// Calculate the actual averages
overall_debit = Math.abs(overall_debit / overall_debit_n);

overall_credit = Math.abs(overall_credit);
overall_credit = overall_credit / overall_credit_n;

// Calculate the overall filter averages
for (var i = 0; i < filter_categories.length; i++) {
    category = filter_categories[i];

    categories[category]['debit_average'] = Math.abs(categories[category]['debit_average'] / categories[category]['debit_n']);

    categories[category]['credit_average'] = Math.abs(categories[category]['credit_average'] / categories[category]['credit_n']);

}


module.exports = {
    'debit_average' : overall_debit,
    'credit_average' : overall_credit,
    'category_filters' : categories,
    'ages' : ages,
    'genders' : genders

};

console.log(module.exports);
