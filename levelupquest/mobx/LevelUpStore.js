import { autorun, observable, action, computed } from 'mobx'
import axios from 'axios'
import _ from 'lodash'
import { Alert } from 'react-native'


class LevelUpStore {
  @observable
  customers = [
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


  @action
  async addToGoals(goal) {
    console.log('add to cart')
    // this.shoppingCart.push(item)
  }


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

    return this.categories
  }
}

const store = (window.store = new LevelUpStore())

export default store
export { LevelUpStore }
