import { addNavigationHelpers, StackNavigator, NavigationActions } from 'react-navigation'

import Home from '../Containers/Core/Home'

import NewGoal from '../Containers/Core/NewGoal'
import Progress from '../Containers/Core/Progress'
import Rewards from '../Containers/Core/Rewards'
import Settings from '../Containers/Core/Settings'

import CategoryFilter from '../Containers/Core/CategoryFilter'
import Graph from '../Containers/Core/Graph'

import { observer } from 'mobx-react'

export const AppNavigator = StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({ title: `Home` })
    },
    NewGoal: {
      screen: NewGoal
    },
    Progress: {
      screen: Progress
    },
    Rewards: {
      screen: Rewards
    },
    Settings: {
      screen: Settings
    },
    CategoryFilter: {
      screen: CategoryFilter
    },
    Graph: {
      screen: Graph
    }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

const RootNavigator = AppNavigator

export { RootNavigator }
