import { observable, action } from 'mobx'
import axios from 'axios'
import _ from 'lodash'

import TWITTER_CONTENT from '../Containers/Core/Twitter'

const API_URL = 'https://api.td-davinci.com/api'
const BACKEND_URL = 'http://52.167.0.206:4527/'

const CUSTOMER_ID = '0373492e-5edd-4fcb-b0b5-46920f720325_be23d561-0198-4876-9d23-2a5e67bad5ff'
const CHEQUING_ACCOUNT_ID = '0373492e-5edd-4fcb-b0b5-46920f720325_b4c1aad5-d0e3-4f1f-9c67-7af7e20e806f'
const SAVINGS_ACCOUNT_ID = '0373492e-5edd-4fcb-b0b5-46920f720325_f71001df-bdff-4524-b5d2-fcbda29a2442'
const AUTH_KEY =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDQlAiLCJ0ZWFtX2lkIjoiNjMzM2JlZmEtNzA1OS0zZjA5LThhYjItNDZmNDY3ZDNjZWUwIiwiZXhwIjo5MjIzMzcyMDM2ODU0Nzc1LCJhcHBfaWQiOiIwMzczNDkyZS01ZWRkLTRmY2ItYjBiNS00NjkyMGY3MjAzMjUifQ.y-ZNl1fo_ey7G5mt62XOVYkUI9Y3Zi6CRJ6JvcWK0AE'

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
  @observable location
  @observable customer = {
    firstName: "",
    lastName: "",
    age: 0,
    gender: "",
    occupation: "",
    relationshipStatus: "",
    habitation: "",
    municipality: ""
  }

  @observable settingsIsInitialized = false
  @observable purchasingPreferences = []
  @observable notificationFrequency = [0]

  @observable chequingAccount = {
    maskedNumber: "0",
    balance: 0
  }
  @observable savingsAccount= {
    maskedNumber: "0",
    balance: 0
  }

  @action
  async getCustomerProfile() {
    const url = `${API_URL}/customers/${CUSTOMER_ID}`

    let res
    try {
      res = await axios.get(url, { headers: { Authorization: AUTH_KEY } })
    } catch (error) {
      console.error(error)
    }

    const info = res.data.result

    this.customer = {
      firstName: info.givenName,
      lastName: info.surname,
      age: info.age,
      gender: info.gender,
      occupation: info.occupationIndustry.substr(5),
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
      res1 = await axios.get(url1, { headers: { Authorization: AUTH_KEY } })
      res2 = await axios.get(url2, { headers: { Authorization: AUTH_KEY } })
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
    let oldCustomerId = '433cbd13-13f4-4eae-85fe-7dd8ce2bd4ea_f775e416-2d6e-43d4-8c7a-3daf69d7b667'
    const url = BACKEND_URL + 'customers/' + oldCustomerId + '/spending/categories'

    let res
    try {
      res = await axios.get(url)
      console.log(res)
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

      const url = BACKEND_URL + 'customers/' + oldCustomerId + '/spending/category/' + categoryName + '/withinDays/30'

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
      if (categoryInfo.net == 0) {
        categoryInfo.net = 154
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
    const url =
      BACKEND_URL + 'metrics/' + categoryName + '?age=' + age + '&gender=' + gender + '&occupation=' + occupation

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
    if (amount == 0 || amount == null){
      amount = Math.floor(Math.random() * Math.floor(150)) + 50
    }

    let obj = {
      name: categoryName,
      average: amount
    }

    let cat = new Category(obj)
    this.populationCategories.push(cat)
  }

  @action
  async transferMoneyFromChequingToSavings(amount) {
    let url = `${API_URL}/transfers`
    let data = {
      amount: amount,
      currency: 'CAD',
      fromAccountID: CHEQUING_ACCOUNT_ID,
      toAccountID: SAVINGS_ACCOUNT_ID
    }
    let config = {
      headers: {
        Authorization: AUTH_KEY,
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
  async getCurrentLocation() {
    await navigator.geolocation.getCurrentPosition(
      position => {
        this.location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      },
      error => {
        console.warn(`ERROR(${error.code}): ${error.message}`)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  }

  @action
  async initializeSettings() {
    await this.getPurchasePreferences()
    this.calculateNotificationFrequency()
    this.settingsIsInitialized = true
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
  calculateNotificationFrequency() {
    let sum = 0

    this.purchasingPreferences.forEach(preference => {
      sum += preference.score
    })

    let newValues = [0]
    newValues[0] = Math.floor(sum) - 1

    this.setNotificationFrequency(newValues)
  }

  @action
  setNotificationFrequency(values) {
    this.notificationFrequency = values
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
