import { Body, Container, Content, Left, List, ListItem, Right, Text } from 'native-base'
import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
// import Modal from 'react-native-modal'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { inject } from 'mobx-react'

// Styles
import styles from './Styles/HomeScreenStyle'
import HeaderComponent from '../../Components/HeaderComponent'

const menuOptions = [
  {
    name: 'New Goal',
    icon: 'ios-calendar-outline',
    screen: 'NewGoal'
  },
  {
    name: 'Progress',
    icon: 'ios-trending-up-outline',
    screen: 'Summary'
  },
  {
    name: 'Settings',
    icon: 'ios-settings-outline',
    screen: 'Settings'
  },
  {
    name: 'Map',
    icon: 'ios-map-outline',
    screen: 'Map'
  },
  {
    name: 'Profile',
    icon: 'ios-contact-outline',
    screen: 'Profile'
  }
]

@inject('levelUpStore')
export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userSelectModalVisible: true,
      userLevel: ''
    }

    this.generateSampleGoal()
    this.populatePreferences()
    this.props.levelUpStore.getCustomerProfile()
    // this.props.levelUpStore.setSampleUserCategoriesList()
  }

  async populatePreferences() {
    await this.props.levelUpStore.getPurchasePreferences()
  }

  generateSampleGoal() {
    let labels = []
    let averages = []
    if (!this.props.levelUpStore.goal) {
      this.props.levelUpStore.setGoal('Vacation', 1000, 0, 'Dec 04 2018', averages, labels)
    }
  }

  _renderIcon({ icon }, size = 50) {
    return <Ionicons name={icon} size={size} color="green" />
  }

  render() {
    return (
      <Container>
        <HeaderComponent>
          <StatusBar translucent={true} backgroundColor="transparent" />
          <Right>
            <Text adjustsFontSizeToFit numberOfLines={1}>
              {this.state.userLevel}
            </Text>
          </Right>
        </HeaderComponent>

        <Content style={{ backgroundColor: '#f3f2f7' }}>
          <List>
            {menuOptions.map((option, index) => (
              <ListItem
                last
                key={index}
                style={{ flexDirection: 'column', backgroundColor: '#fff' }}
                onPress={() => this.props.navigation.navigate(option.screen)}
              >
                <Left style={styles.iconWrapper}>
                  <View style={styles.iconWrapper}>{this._renderIcon(option)}</View>
                </Left>
                <Body>
                  <Text style={{ color: '#333333' }}>{option.name}</Text>
                </Body>
              </ListItem>
            ))}
            <ListItem itemDivider />
          </List>

          {/* <Modal
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onBackdropPress={() => {
              this.state.customerInfoVisible = false
            }}
            onSwipe={() => {
              this.state.customerInfoVisible = false
            }}
            swipeDirection="down"
            backdropColor={'black'}
            backdropOpacity={0.9}
            isVisible={this.state.userSelectModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.')
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Button
                success
                block
                onPress={() => {
                  this.setUserLevel('STAFF')
                }}
              >
                <Text>Staff</Text>
              </Button>
              <View style={{ paddingVertical: 20 }} />
              <Button
                success
                block
                onPress={() => {
                  this.setUserLevel('CUSTOMER')
                }}
              >
                <Text>Customer</Text>
              </Button>
            </View>
          </Modal> */}
        </Content>
      </Container>
    )
  }
}
