
// Get the config data
var conf = require('./config');
const PORT = conf['PORT'];

// Get the sample data
var sample_data = require('./data');
sample_data = JSON.parse(sample_data);
sample_data = sample_data['result'];

// Get the customer's data
var customers_data = require('./customers');
customers_data = JSON.parse(customers_data);

// This gives us an array of dicts
customers_data = customers_data['result'];

// What we need is a dict, we assemble that
var customers_dict = {};
for (var i = 0; i < customers_data.length; i++) {
  var customer = customers_data[i];

  customers_dict[customer.id] = customer;
}


var filter_categories = ['Entertainment', 'Retail', 'Fast food', 'Salary', 'Rent', 'Utility bill', 'eTransfer', 'Tax', 'Insurance', 'Mortgage'];
var categories = {}; // Overall spending per each filter
var ages = {}; // Spending per each filter, age dependant
var genders = {}; // Spending per each filter, gender dependant

const GENDER_LIST = ['Male', 'Female', 'Other'];

// Get the common functions
var common_functions = require('./comm');
var convert_age = common_functions['convert_age'];

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
// Ages are bunched into blocks of five
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

// Initialize genders structure
genders['Male'] = {};
genders['Female'] = {};
genders['Other'] = {};
for (var j = 0; j < filter_categories.length; j++) {
  category = filter_categories[j];
  genders['Male'][category] = {
    'debit_average': 0,
    'credit_average': 0,
    'debit_n': 0,
    'credit_n': 0
  };

  genders['Female'][category] = {
    'debit_average': 0,
    'credit_average': 0,
    'debit_n': 0,
    'credit_n': 0
  };

  genders['Other'][category] = {
    'debit_average': 0,
    'credit_average': 0,
    'debit_n': 0,
    'credit_n': 0
  };
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

  if (user_array.length == 0) {
    continue;
  }

  // The user associated with the transaction
  var transaction = user_array[0];
  var transaction_user = customers_dict[transaction.customerId];
  var user_age = convert_age(transaction_user.age);
  var user_gender = transaction_user.gender;

  var has_spent = {'debits': [],
  'credits': []};

  for (var j = 0; j < user_array.length; j++) {
    // Iterate over each transaction for the user
    transaction = user_array[j];

    if (transaction.type == "CreditCardTransaction") {
      transaction.currencyAmount = transaction.currencyAmount * -1;
    }

    // TODO: Fix this
    if (isDebit(transaction)) {
      overall_debit = overall_debit + transaction.currencyAmount;
      //overall_debit_n = overall_debit_n + 1;
    } else {
      overall_credit = overall_credit + transaction.currencyAmount;
      //overall_credit_n = overall_credit_n + 1;
    }

    for (var k = 0; k < filter_categories.length; k++) {
      // Handle the overall filters
      category = filter_categories[k];
      if (transaction.categoryTags.includes(category)) {
        if (isDebit(transaction)) {
          categories[category]['debit_average'] = categories[category]['debit_average'] + transaction.currencyAmount;
          has_spent['debits'].push(category);
          //categories[category]['debit_n'] = categories[category]['debit_n'] + 1;
        } else {
          categories[category]['credit_average'] = categories[category]['credit_average'] + transaction.currencyAmount;
          has_spent['credits'].push(category);
          //categories[category]['credit_n'] = categories[category]['credit_n'] + 1;
        }
      }
    }


    // Handle the age filters
    for (var k = 0; k < filter_categories.length; k++) {
      // Handle the overall filters
      category = filter_categories[k];
      if (transaction.categoryTags.includes(category)) {
        if (isDebit(transaction)) {
          ages[user_age][category]['debit_average'] = ages[user_age][category]['debit_average'] + transaction.currencyAmount;
          //ages[user_age][category]['debit_n'] = ages[user_age][category]['debit_n'] + 1;
        } else {
          ages[user_age][category]['credit_average'] = ages[user_age][category]['credit_average'] + transaction.currencyAmount;
          //ages[user_age][category]['credit_n'] = ages[user_age][category]['credit_n'] + 1;
        }
      }
    }

    // Handle the gender filters
    for (var k = 0; k < filter_categories.length; k++) {
      // Handle the overall filters
      category = filter_categories[k];
      if (transaction.categoryTags.includes(category)) {
        if (isDebit(transaction)) {
          genders[user_gender][category]['debit_average'] = genders[user_gender][category]['debit_average'] + transaction.currencyAmount;
          //genders[user_gender][category]['debit_n'] = genders[user_gender][category]['debit_n'] + 1;
        } else {
          genders[user_gender][category]['credit_average'] = genders[user_gender][category]['credit_average'] + transaction.currencyAmount;
          //genders[user_gender][category]['credit_n'] = genders[user_gender][category]['credit_n'] + 1;
        }
      }

    }

  }

  // Add the n if needed
  for (var k = 0; k < filter_categories.length; k++) {
    category = filter_categories[k];
    if (has_spent['debits'].includes(category)) {


      ages[user_age][category]['debit_n']++;
      genders[user_gender][category]['debit_n']++;

    }

    if (has_spent['credits'].includes(category)) {

      ages[user_age][category]['credit_n']++;
      genders[user_gender][category]['credit_n']++;
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

// Divide ages
for (var i = 0; i < 100; i=i + 5) {

  for (var j = 0; j < filter_categories.length; j++) {
    category = filter_categories[j];

    ages[i.toString()][category]['debit_average'] = ages[i.toString()][category]['debit_average'] / ages[i.toString()][category]['debit_n'];
    ages[i.toString()][category]['credit_average'] = ages[i.toString()][category]['credit_average'] / ages[i.toString()][category]['credit_n'];
  }
}

// Divide genders
for (var i = 0; i < GENDER_LIST.length; i++) {
  var selected_gender = GENDER_LIST[i];

  for (var j = 0; j < filter_categories.length; j++) {
    category = filter_categories[j];

    genders[selected_gender][category]['debit_average'] = genders[selected_gender][category]['debit_average'] / genders[selected_gender][category]['debit_n'];
    genders[selected_gender][category]['credit_average'] = genders[selected_gender][category]['credit_average'] / genders[selected_gender][category]['credit_n'];
  }
}

module.exports = {
  'debit_average' : overall_debit,
  'credit_average' : overall_credit,
  'category_filters' : categories,
  'ages' : ages,
  'genders' : genders

};
