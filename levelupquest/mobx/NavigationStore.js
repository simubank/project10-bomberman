import { action, autorun, observable } from 'mobx'
import { createReactNavigationReduxMiddleware, createReduxBoundAddListener } from 'react-navigation-redux-helpers'

import { RootNavigator } from '../Navigation/RootNavigator'

// this is required - do not remove
createReactNavigationReduxMiddleware('root', state => state.nav)

const addListener = createReduxBoundAddListener('root')

class NavigationStore {
  @observable isLoading = false

  @action
  toggleLoading(isLoading) {
    if (isLoading !== undefined) {
      this.isLoading = isLoading
    } else {
      this.isLoading = !this.isLoading
    }
  }

  @observable.ref
  navigationState = {
    index: 0,
    routes: [
      {
        key: 'Home',
        routeName: 'Home',
        params: { title: 'Home' }
      }
    ]
  }

  @action
  dispatch = (action, stackNavState = true) => {
    const previousNavState = stackNavState ? this.navigationState : null
    return (this.navigationState = RootNavigator.router.getStateForAction(action, previousNavState))
  }
}

const store = new NavigationStore()

const navigationHelpers = {
  dispatch: store.dispatch,
  state: store.navigationState,
  addListener
}

export default store
export { NavigationStore, navigationHelpers }

autorun(() => {
  console.log(store)
})
