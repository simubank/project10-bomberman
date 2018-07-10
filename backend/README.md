

GET /customers/:customerId/spending/:category
 * The amount of spending by the customer within the category overall

GET /customers/:customerId/spending/:category/withinDays/:days
 * The amount of spending by the customer within the category within the past <days> number of days

GET /customers/:customerId/limits/:category
 * Returns the spending limit for the customer for a certain category

POST /customers/:customerId/limits/:category
 * Updates/sets the spending limit for the customer for a certain category