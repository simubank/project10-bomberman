import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Root } from 'native-base'

import { StackNavigator, NavigationActions } from 'react-navigation'

import { createReduxBoundAddListener } from 'react-navigation-redux-helpers'

import { RootNavigator } from './Navigation/RootNavigator'
import { NavigationStore } from './mobx/NavigationStore'
import retailStore from './mobx/RetailStore'
import firebaseStore from './mobx/FirebaseStore'

import { observer, Provider } from 'mobx-react'

const addListener = createReduxBoundAddListener('root')

@observer
export default class App extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.store = new NavigationStore()
    console.disableYellowBox = true
  }

  render() {
    return (
      <Root>
        <Provider store={this.store} retailStore={retailStore} firebaseStore={firebaseStore}>
          <RootNavigator
            navigation={{
              dispatch: this.store.dispatch,
              state: this.store.navigationState,
              addListener
            }}
          />
        </Provider>
      </Root>
    )
  }
}
