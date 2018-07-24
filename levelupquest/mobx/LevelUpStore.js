import { autorun, observable, action, computed } from 'mobx'
import axios from 'axios'
import _ from 'lodash'
import { Alert } from 'react-native'

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
  @observable deadline

  constructor(title, amount, deadline, cat) {
    this.title = title
    this.amount = amount
    this.deadline = deadline
    this.categories = cat
  }
}

class LevelUpStore {
  @observable customers = [
    {
      id: '',
      name: '',
      gender: '',
      age: 0,
      isMarried: false,
      entryTime: '',
      customerSince: '',
      status: '',
      location: '',
      purchases: [
        {
          productID: '',
          productName: ''
        }
      ]
    }
  ]
  @observable categories = []
  @observable userCategories = []
  @observable goals = []

  @action
  async getCategoryList() {
    const customerID = '433cbd13-13f4-4eae-85fe-7dd8ce2bd4ea_f775e416-2d6e-43d4-8c7a-3daf69d7b667'
    const url = 'http://localhost:4527/customers/' + customerID + '/spending/categories'

    let res

    try {
      res = await axios.get(url)
    } catch (error) {
      console.error(error)
    }

    const categoryList = res.data.result
    const categoriesToSkip = ['eTransfer', 'Salary', 'Tax']

    await categoryList.forEach(async categoryName => {
      let skip = _.find(categoriesToSkip, obj => {
        return obj === categoryName
      })

      if (skip) {
        return
      }

      const customerID = '433cbd13-13f4-4eae-85fe-7dd8ce2bd4ea_f775e416-2d6e-43d4-8c7a-3daf69d7b667'
      const url =
        'http://localhost:4527/customers/' + customerID + '/spending/category/' + categoryName + '/withinDays/30'

      let res2

      try {
        res2 = await axios.get(url)
      } catch (error) {
        console.error(error)
      }

      const categoryInfo = res2.data.result

      if (categoryInfo.net < 0) {
        categoryInfo.net = -categoryInfo.net
      }

      const obj = {
        name: categoryName,
        amount: categoryInfo.net,
        selected: false,
        target: categoryInfo.net,
        current: categoryInfo.net,
        status: 'N/A'
      }

      this.categories.push(obj)
    })

    // this.categories = categoriesObject.map(obj =>
    //   Category.fromResponseObject(obj)
    // )

    return this.categories
  }

  @action
  setSampleCategoriesList() {
    let obj1 =  { name: "Fast Food", average: 70.30}
    let obj2 = { name: "Retail", average: 50.2}
    let obj3 = { name: "Insurance", average: 130.9}
    let obj4 = { name: "House", average: 200 }
    let obj5 = { name: "Other", average: 22.11 }

    let cat1 = new Category(obj1)
    let cat2 = new Category(obj2)
    let cat3 = new Category(obj3)
    let cat4 = new Category(obj4)
    let cat5 = new Category(obj5)

    this.categories.push(cat1)
    this.categories.push(cat2)
    this.categories.push(cat3)
    this.categories.push(cat4)
    this.categories.push(cat5)

    return this.categories
  }

  @action
  setSampleUserCategoriesList() {
    let obj1 =  { name: "Fast Food", average: 53.11}
    let obj2 = { name: "Retail", average: 79}
    let obj3 = { name: "Insurance", average: 100.23}
    let obj4 = { name: "House", average: 25.93 }
    let obj5 = { name: "Other", average: 25 }

    let cat1 = new Category(obj1)
    let cat2 = new Category(obj2)
    let cat3 = new Category(obj3)
    let cat4 = new Category(obj4)
    let cat5 = new Category(obj5)

    this.userCategories.push(cat1)
    this.userCategories.push(cat2)
    this.userCategories.push(cat3)
    this.userCategories.push(cat4)
    this.userCategories.push(cat5)

    return this.userCategories
  }

  @action
  addGoal(title, amount, deadline, cat) {
    let goal = new Goal(title, amount, deadline, cat)
    this.goals.push(goal)
  }
}

const store = (window.store = new LevelUpStore())

export default store
export { LevelUpStore }
