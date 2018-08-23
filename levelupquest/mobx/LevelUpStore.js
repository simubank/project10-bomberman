import { observable, action } from 'mobx'
import axios from 'axios'
import _ from 'lodash'

import TWITTER_CONTENT from '../Containers/Core/Twitter'

const API_URL = 'https://botsfinancial.com/api'
const BACKEND_URL = 'http://localhost:4527/'

const CUSTOMER_ID = '433cbd13-13f4-4eae-85fe-7dd8ce2bd4ea_f775e416-2d6e-43d4-8c7a-3daf69d7b667'
const CHEQUING_ACCOUNT_ID = '433cbd13-13f4-4eae-85fe-7dd8ce2bd4ea_15de14d9-04c7-490e-bb42-15d810c2e77e'
const SAVINGS_ACCOUNT_ID = '433cbd13-13f4-4eae-85fe-7dd8ce2bd4ea_384d8493-b9f8-46a4-863f-218a3900e884'
const AUTH_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDQlAiLCJ0ZWFtX2lkIjoiMjgxMzgyMSIsImV4cCI6OTIyMzM3MjAzNjg1NDc3NSwiYXBwX2lkIjoiNDMzY2JkMTMtMTNmNC00ZWFlLTg1ZmUtN2RkOGNlMmJkNGVhIn0.AeY8PVB5r3pKBPf52APbmQWWweg0vY_78wBkoZNmkmE'

const FILTERS = [
  {
    name: 'Age',
    selected: false
  },
  {
    name: 'Gender',
    selected: false
  },
  {
    name: 'Occupation',
    selected: false
  },
  {
    name: 'Relationship Status',
    selected: false
  },
  {
    name: 'Habitation',
    selected: false
  },
  {
    name: 'Municipality',
    selected: false
  }
]

class Category {
  @observable name
  @observable average

  constructor(value) {
    this.name = value.name
    this.average = value.average
  }

  static fromResponseObject(response) {
    return new Category(response)
  }
}

class Goal {
  @observable categories = []
  @observable title
  @observable amount
  @observable amountProgress
  @observable deadline

  constructor(title, amount, amountProgress, deadline, cat, labels) {
    this.title = title
    this.amount = amount
    this.amountProgress = amountProgress
    this.deadline = deadline
    this.categories = cat.map((item, index) => ({
      name: labels[index],
      average: cat[index],
      current: 0
    }))
  }
}

class LevelUpStore {
  @observable userCategories = []
  @observable populationCategories = []
  @observable filters = FILTERS
  
  @observable goal
  @observable customer
  @observable purchasingPreferences = []

  @observable chequingAccount
  @observable savingsAccount
  
  @action
  async getCustomerProfile() {
    const url = `${API_URL}/customers/${CUSTOMER_ID}`

    let res
    try {
      res = await axios.get(url, { headers: { 'Authorization': AUTH_KEY } })
    } catch (error) {
      console.error(error)
    }

    const info = res.data.result[0]

    this.customer = {
      firstName: info.givenName,
      lastName: info.surname,
      age: info.age,
      gender: info.gender,
      occupation: info.primaryOccupation,
      relationshipStatus: info.relationshipStatus,
      habitation: info.habitationStatus,
      municipality: info.addresses.principalResidence.municipality
    }
  }

  @action
  async getAccountInformation() {
    const url1 = `${API_URL}/accounts/${CHEQUING_ACCOUNT_ID}`
    const url2 = `${API_URL}/accounts/${SAVINGS_ACCOUNT_ID}`

    let res1
    let res2
    try {
      res1 = await axios.get(url1, { headers: { 'Authorization': AUTH_KEY } })
      res2 = await axios.get(url2, { headers: { 'Authorization': AUTH_KEY } })
    } catch (error) {
      console.error(error)
    }

    const info1 = res1.data.result.bankAccount
    const info2 = res2.data.result.bankAccount

    this.chequingAccount = {
      maskedNumber: info1.maskedAccountNumber,
      balance: info1.balance
    }

    this.savingsAccount = {
      maskedNumber: info2.maskedAccountNumber,
      balance: info2.balance
    }
  }

  @action
  async getUserCategories() {
    const url = BACKEND_URL + 'customers/' + CUSTOMER_ID + '/spending/categories'

    let res
    try {
      res = await axios.get(url)
    } catch (error) {
      console.error(error)
    }

    const categoryList = res.data.result
    const categoriesToSkip = ['eTransfer', 'Salary', 'Tax', 'Mortgage']

    await categoryList.forEach(async categoryName => {
      let skip = _.find(categoriesToSkip, obj => {
        return obj === categoryName
      })

      if (skip) return

      const url = BACKEND_URL + 'customers/' + CUSTOMER_ID + '/spending/category/' + categoryName + '/withinDays/30'

      let res2
      try {
        res2 = await axios.get(url)
      } catch (error) {
        console.error(error)
      }

      let categoryInfo = res2.data.result

      if (categoryInfo.net < 0) {
        categoryInfo.net = -categoryInfo.net
      }

      let obj = {
        name: categoryName,
        average: categoryInfo.net,
        selected: false
      }

      let cat = new Category(obj)
      this.userCategories.push(cat)
    })

    return this.userCategories
  }

  @action
  async getPopulationCategory(categoryName, age, gender, occupation) {
    const url = BACKEND_URL + 'metrics/' + categoryName + '?age=' + age + '&gender=' + gender + '&occupation=' + occupation

    let res
    try {
      res = await axios.get(url)
    } catch (error) {
      console.error(error)
    }

    let amount = 0
    let result = res.data.result

    if (result.debit_average) {
      amount = result.debit_average
    } else {
      amount = result.credit_average
    }
    if (amount < 0) {
      amount = -amount
    }

    let obj = {
      name: categoryName,
      average: amount
    }

    let cat = new Category(obj)
    this.populationCategories.push(cat)
  }

  @action
  async depositMoneyToAccount(amount) {
    let url = `${API_URL}/transfers`
    let data = {
      'amount': amount,
      'currency': 'CAD',
      'fromAccountID': CHEQUING_ACCOUNT_ID,
      'toAccountID': SAVINGS_ACCOUNT_ID
    }
    let config = {
      headers: {
        'Authorization': AUTH_KEY,
        'Content-Type': 'application/json'
      }
    }

    let res
    try {
      res = await axios.post(url, data, config)
    } catch (error) {
      console.error(error)
    }

    return res.data
  }

  @action
  async getPurchasePreferences() {
    let res = await fetch(
      'https://gateway.watsonplatform.net/personality-insights/api/v3/profile?version=2017-10-13&consumption_preferences=true&raw_scores=true',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Basic MWVmYjQ3MjctZWFiNy00NWY5LTkyY2QtZWMxNDE2OTI2ZDU5OnJIbjNYRlhlNnJ4aA==',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(TWITTER_CONTENT)
      }
    )

    let data = await res.json()
    let preferences = data.consumption_preferences[0].consumption_preferences

    this.purchasingPreferences = _.dropRight(_.drop(_.reverse(preferences)), 5)
  }

  @action
  resetCategoriesAndFilters() {
    this.userCategories = []
    this.populationCategories = []

    this.filters.forEach(filter => {
      filter.selected = false
    })
  }

  @action
  resetPopulationCategories() {
    this.populationCategories = []
  }

  @action
  setGoal(title, amount, amountProgress, deadline, cat, labels) {
    this.goal = new Goal(title, amount, amountProgress, deadline, cat, labels)
  }
}

const store = (window.store = new LevelUpStore())

export default store
export { LevelUpStore }
