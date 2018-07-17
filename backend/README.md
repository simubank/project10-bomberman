API Documentation
===

## Uses only the Bank API

GET /customers/:customerId/spending/:category
 * The amount of spending by the customer within the category overall for transactions that have already passed
 * Functioning, untested

GET /customers/:customerId/spending/:category/withinDays/:days
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

GET /customers/:customerId/categories
* Returns all the categories of transactions by a certain customer for transactions that have already passed
* Functioning, untested

GET /customers/:customerId/info
* Returns the information on the customer, basically straight copied from the API
* Functioning

---
## Uses the Simulants API

GET /metrics/...
* TBD

## Implementation Details
* Express with Node.js