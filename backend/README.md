API Documentation
===

## Uses only the Bank API

GET /customers/:customerId/spending/category/:category
 * The amount of spending by the customer within the category overall for transactions that have already passed
 * Functioning, untested

GET /customers/:customerId/spending/category/:category/withinDays/:days
 * The amount of spending by the customer within the category within the past <days> number of days
 * Functioning, untested
 * Suggested Use: get the transactions for the past 60 days, subtract the transactions from the past 30 days, this gives you most of the previous month's transactions for the category

GET /customers/:customerId/spending
* The amount of spending by the customer overall for transactions that have already passed
* Functioning, untested

GET /customers/:customerId/spending/withinDays/:days
 * The amount of spending by the customer within the past <days> number of days
 * Functioning, untested
 * Suggested Use: get the transactions for the past 60 days, subtract the transactions from the past 30 days, this gives you most of the previous month's transactions

GET /customers/:customerId/limits/:category
 * Returns the spending limit for the customer for a certain category
 * TBD

POST /customers/:customerId/limits/:category
 * Updates/sets the spending limit for the customer for a certain category
 * TBD

GET /customers/:customerId/spending/categories
* Returns all the categories of transactions by a certain customer for transactions that have already passed
* Functioning, untested

GET /customers/:customerId/info
* Returns the information on the customer, basically straight copied from the API
* Functioning

GET /cashback/:accountId
* Returns the amount of cashback's the user has received in total
* TBD

POST /cashback/:accountId
* Sends a cashback to the account :accountId
* The cashback amount is set in a dictionary sent with the request in the 'amount' key
* TBD

## Uses the Simulants API

GET /customers/
* Get all customers
* TBD

GET /transactions
* Get all the transactions for all customers
* TBD

GET /metrics/...
* TBD

GET /transactions/withinDays/:days
* Returns a sample of the transactions that occurred within <days> days

## Implementation Details
* Express with Node.js