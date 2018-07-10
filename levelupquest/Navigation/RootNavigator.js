import { addNavigationHelpers, StackNavigator, NavigationActions } from 'react-navigation'

import Home from '../Containers/Core/Home'
// import NewScreen from '../Containers/Retail/CaptureScreen'

import { observer } from 'mobx-react'

export const AppNavigator = StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({ title: `Home` })
    },
    // NewScreen: {
    //   screen: NewScreenName
    // }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

const RootNavigator = AppNavigator

export { RootNavigator }
