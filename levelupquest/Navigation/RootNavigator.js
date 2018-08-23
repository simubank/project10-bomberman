import { StackNavigator } from 'react-navigation'

import Home from '../Containers/Core/Home'

import NewGoal from '../Containers/Core/NewGoal'
import Progress from '../Containers/Core/Progress'
import Settings from '../Containers/Core/Settings'
import LocationMap from '../Containers/Core/Map'
import Account from '../Containers/Core/Account'

import CategoryFilter from '../Containers/Core/CategoryFilter'
import Graph from '../Containers/Core/Graph'

export const AppNavigator = StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({ title: `Home` })
    },
    NewGoal: {
      screen: NewGoal
    },
    CategoryFilter: {
      screen: CategoryFilter
    },
    Graph: {
      screen: Graph
    },
    Progress: {
      screen: Progress
    },
    Settings: {
      screen: Settings
    },
    Map: {
      screen: LocationMap
    },
    Account: {
      screen: Account
    }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

const RootNavigator = AppNavigator

export { RootNavigator }
