

GET /customers/:customerId/spending/:category
 * The amount of spending by the customer within the category overall for transactions that have already passed
 * Functioning, untested

GET /customers/:customerId/spending/:category/withinDays/:days
 * The amount of spending by the customer within the category within the past <days> number of days
 * Functioning, untested

GET /customers/:customerId/limits/:category
 * Returns the spending limit for the customer for a certain category
 * TBD

POST /customers/:customerId/limits/:category
 * Updates/sets the spending limit for the customer for a certain category
 * TBD

GET /customers/:customerId/categories
* Returns all the categories of transactions by a certain customer for transactions that have already passed
* Functioning, untested