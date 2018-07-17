import { autorun, observable, action, computed } from 'mobx'
import axios from 'axios'
import _ from 'lodash'
import { Alert } from 'react-native'

import firebase from 'firebase'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBWpt-mGjIN318ug_wza9ScA3YX5lKYxuU',
  authDomain: 'gcp-retail-1ccf3.firebaseapp.com',
  databaseURL: 'https://gcp-retail-1ccf3.firebaseio.com',
  storageBucket: 'gs://gcp-retail-1ccf3.appspot.com'
}
firebase.initializeApp(config)

// Get a reference to the database service
var database = firebase.database()

const customerIDs = ['2001', '2002', '2003']

// writeProductData('1009', products[0])
function writeProductData(productID, obj) {
  firebase
    .database()
    .ref('products/' + productID)
    .set(obj)
}

// writeCustomerData('2004', customers[2])
function writeCustomerData(customerID, obj) {
  firebase
    .database()
    .ref('customers/' + customerID)
    .set(obj)
}

// readCustomerData('2001')
function readCustomerData(customerID) {
  firebase
    .database()
    .ref('customers/' + customerID)
    .on('value', function(snapshot) {
      console.log(snapshot.child('name').node_.value_)
    })
}

function updateCustomerData(customerID) {
  var customerObj = {
    id: '2001',
    name: 'Alex Smith 123',
    gender: 'Male',
    age: 38,
    isMarried: true,
    entryTime: 'now',
    customerSince: '11/16/2017',
    status: 'SUCCESS',
    location: 'Aisle 10',
    purchases: [
      {
        productID: '1001',
        productName: 'Nintendo Switch'
      },
      {
        productID: '1002',
        productName: 'Cotton Textured Shirt'
      }
    ]
  }

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {}
  updates['/customers/' + customerID] = customerObj

  return firebase
    .database()
    .ref()
    .update(updates)
}

class FirebaseStore {
  @observable
  products = [
    {
      product_id: '',
      sku: '',
      product_type: '',
      inventory: 0,
      property_id: '',
      price: 0,
      description: '',
      title: '',
      photo_url: '',
      company: '',
      rating: 0
    }
  ]

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

  @observable shoppingCart = []

  @computed
  get subtotal() {
    let sum = 0

    this.shoppingCart.map(item => {
      sum += parseFloat(item.price.substr(1))
    })

    return sum
  }

  @action
  resetShoppingCart() {
    console.log('reset')
    this.shoppingCart = []
    this.updateCustomerStatus('2001', 'CHECKED_OUT')
  }

  @observable firstFirebaseCallHelp = true
  @observable firstFirebaseCallRespond = true

  @action
  async getProducts() {
    try {
      var snapshot = null

      await firebase
        .database()
        .ref('products')
        .once('value')
        .then(function(snap) {
          snapshot = snap
        })

      this.products = [] // reset

      snapshot.forEach(ss => {
        const product = {
          product_id: ss.child('product_id').node_.value_,
          sku: ss.child('sku').node_.value_,
          product_type: ss.child('product_type').node_.value_,
          inventory: ss.child('inventory').node_.value_,
          property_id: ss.child('property_id').node_.value_,
          price: ss.child('price').node_.value_,
          description: ss.child('description').node_.value_,
          title: ss.child('title').node_.value_,
          photo_url: ss.child('photo_url').node_.value_,
          company: ss.child('company').node_.value_,
          rating: ss.child('rating').node_.value_
        }

        this.products.push(product)
      })
    } catch (error) {
      console.log(error)
    }
  }

  @action
  async getCustomers() {
    try {
      var snapshot = null

      await firebase
        .database()
        .ref('customers')
        .once('value')
        .then(function(snap) {
          snapshot = snap
        })

      this.customers = [] // reset

      snapshot.forEach(ss => {
        const customer = {
          id: ss.child('id').node_.value_,
          name: ss.child('name').node_.value_,
          gender: ss.child('gender').node_.value_,
          age: ss.child('age').node_.value_,
          isMarried: ss.child('isMarried').node_.value_,
          entryTime: ss.child('entryTime').node_.value_,
          customerSince: ss.child('customerSince').node_.value_,
          status: ss.child('status').node_.value_,
          location: ss.child('location').node_.value_,
          beingServed: ss.child('beingServed').node_.value_,
          purchases: [
            {
              productID: '1001',
              productName: 'Nintendo Switch'
            },
            {
              productID: '1002',
              productName: 'Cotton Textured Shirt'
            }
          ]
        }

        this.customers.push(customer)
      })
    } catch (error) {
      console.log(error)
    }
  }

  @action
  async addToCart(item) {
    console.log('add to cart')
    this.shoppingCart.push(item)
  }

  @action
  async pushNotificationCustomerNeedsHelp(customerID = '2001') {
    try {
      var customerHelpListener = firebase.database().ref('customers/' + customerID + '/status')

      customerHelpListener.on('value', async snap => {
        var snapshot = null

        if (this.firstFirebaseCallHelp) {
          this.firstFirebaseCallHelp = false
        } else if (snap.val() === 'CHECKED_OUT') {
          await firebase
            .database()
            .ref('customers/' + customerID)
            .once('value')
            .then(snap => {
              snapshot = snap.val()

              Alert.alert('Customer Checked Out', 'Name: ' + snapshot.name, [{ text: 'Okay' }])
            })
        } else if (snap.val() === 'NEED_HELP') {
          await firebase
            .database()
            .ref('customers/' + customerID)
            .once('value')
            .then(snap => {
              snapshot = snap.val()

              Alert.alert(
                'Customer Needs Help',
                'Name: ' +
                  snapshot.name +
                  '\n' +
                  'Location: ' +
                  snapshot.location +
                  '\n' +
                  'Gender: ' +
                  snapshot.gender +
                  '\n' +
                  'Age: ' +
                  snapshot.age +
                  '\n' +
                  'Married: ' +
                  snapshot.isMarried,
                [
                  {
                    text: 'Ignore',
                    style: 'cancel',
                    onPress: () => {
                      console.log('ignore')
                    }
                  },
                  {
                    text: 'Accept',
                    onPress: () => {
                      this.updateCustomerBeingServed(customerID, true)

                      Alert.alert('Serving Customer', 'Click OK when done serving customer.', [
                        {
                          text: 'OK',
                          onPress: () => {
                            this.updateCustomerBeingServed(customerID, false)
                            this.updateCustomerStatus(customerID, 'ONLINE')
                          }
                        }
                      ])
                    }
                  }
                ]
              )
            })
        } else {
          console.log('other')
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  @action
  async pushNotificationAdminRespondingToHelp(customerID = '2001') {
    try {
      var customerHelpListener = firebase.database().ref('customers/' + customerID + '/beingServed')
      customerHelpListener.on('value', async snap => {
        var snapshot = null
        if (this.firstFirebaseCallRespond) {
          this.firstFirebaseCallRespond = false
        } else {
          await firebase
            .database()
            .ref('customers/' + customerID)
            .once('value')
            .then(function(snap) {
              snapshot = snap.val()

              if (snapshot.beingServed === true) {
                Alert.alert('An employee is on the way!')
              }
            })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  @action
  async updateCustomerBeingServed(customerID, beingServed) {
    var updates = {}
    updates['/customers/' + customerID + '/beingServed/'] = beingServed

    return firebase
      .database()
      .ref()
      .update(updates)
  }

  @action
  async updateCustomerStatus(customerID = '2001', status) {
    var updates = {}

    updates['/customers/' + customerID + '/status/'] = status

    return firebase
      .database()
      .ref()
      .update(updates)
  }
}

const store = (window.store = new FirebaseStore())

export default store
export { FirebaseStore }
