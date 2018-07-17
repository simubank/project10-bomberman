// Get the sample data
var sample_data = require('./data');
sample_data = JSON.parse(sample_data);
sample_data = sample_data['result'];

function isDebit(transaction) {
    if (transaction.currencyAmount < 0) {
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

	if (isDebit(transaction)) {
	    overall_debit = overall_debit + transaction.currencyAmount;
	    overall_debit_n = overall_debit_n + 1;
	} else {
	    overall_credit = overall_credit + transaction.currencyAmount;
	    overall_credit_n = overall_credit_n + 1;
	}
    }

}

// Calculate the actual averages
overall_debit = overall_debit / overall_debit_n;

overall_credit = overall_credit * -1;
overall_credit = overall_credit / overall_credit_n;

console.log(overall_debit);
console.log(overall_credit);

module.exports = {
    'debit_average' : overall_debit,
    'credit_average' : overall_credit

};

console.log(module.exports);
