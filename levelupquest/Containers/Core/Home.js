import { Body, Button, Container, Content, Header, Left, List, ListItem, Right, Text, Footer } from 'native-base'
import React, { Component } from 'react'
import { Dimensions, Image, View, StatusBar } from 'react-native'
import SideMenu from 'react-native-side-menu'
import Carousel from 'react-native-snap-carousel'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { inject, observer } from 'mobx-react'

// Styles
import styles from './Styles/HomeScreenStyle'
import HeaderComponent from '../../Components/HeaderComponent'


const menuOptions = [
  {
    name: 'New Goal',
    icon: 'ios-calendar-outline',
    iconSet: 'Ionicons',
    screen: 'NewGoal',
    color: 'red'
  },
  {
    name: 'Progress',
    icon: 'ios-trending-up-outline',
    iconSet: 'Ionicons',
    screen: 'Summary',
    color: '#b3b300'
  },
  {
    name: 'Rewards',
    icon: 'ios-trophy-outline',
    iconSet: 'Ionicons',
    screen: 'Rewards',
    color: 'green'
  },
  {
    name: 'Settings',
    icon: 'ios-settings-outline',
    iconSet: 'Ionicons',
    screen: 'Settings',
    color: 'blue'
  },
  {
    name: 'Graph',
    icon: 'ios-stats-outline',
    iconSet: 'Ionicons',
    screen: 'Graph',
    color: 'purple'
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
  }

  _renderIcon({ icon, iconSet, color }, size = 50) {
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
