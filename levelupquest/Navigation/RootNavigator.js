import { StackNavigator } from 'react-navigation'

import Home from '../Containers/Core/Home'

import NewGoal from '../Containers/Core/NewGoal'
import Settings from '../Containers/Core/Settings'

import CategoryFilter from '../Containers/Core/CategoryFilter'
import Graph from '../Containers/Core/Graph'
import Summary from '../Containers/Core/Summary'
import LocationMap from '../Containers/Core/Map'
import Profile from '../Containers/Core/Profile'

export const AppNavigator = StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({ title: `Home` })
    },
    NewGoal: {
      screen: NewGoal
    },
    Settings: {
      screen: Settings
    },
    CategoryFilter: {
      screen: CategoryFilter
    },
    Graph: {
      screen: Graph
    },
    Summary: {
      screen: Summary
    },
    Map: {
      screen: LocationMap
    },
    Profile: {
      screen: Profile
    }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

const RootNavigator = AppNavigator

export { RootNavigator }
