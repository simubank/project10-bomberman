import { Body, Button, Container, Content, Header, Left, List, ListItem, Right, Text, Footer } from 'native-base'
import React, { Component } from 'react'
import { Dimensions, Image, View, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { inject, observer } from 'mobx-react'
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'

// Styles
import styles from './Styles/HomeScreenStyle'
import HeaderComponent from '../../Components/HeaderComponent'

const adminOptions = [
  {
    name: 'Customer List',
    icon: 'ios-people-outline',
    iconSet: 'Ionicons',
    screen: 'CustomerList',
    color: 'red'
  }
]

const workingOptions = [
  {
    name: 'Shopping Cart',
    icon: 'ios-cart-outline',
    iconSet: 'Ionicons',
    screen: 'ShoppingCart',
    color: '#b3b300'
  },
  {
    name: 'Scan Barcode',
    icon: 'ios-barcode-outline',
    iconSet: 'Ionicons',
    screen: 'CaptureScreen',
    color: 'green'
  },
  {
    name: 'Capture Product',
    icon: 'ios-camera-outline',
    iconSet: 'Ionicons',
    screen: 'CaptureProduct',
    color: 'blue'
  }
]

const horizontalMargin = 20
const slideWidth = 280
const sliderWidth = Dimensions.get('window').width
const itemWidth = slideWidth + horizontalMargin * 2

const yAxisData = [ 14, 1, 100, 95, 94, 24, 8, 85, 91, 35, 53, 53, 78 ]
const xAxisData = [
  {
    value: 50,
    date: 'g',
  },
  {
    value: 10,
    date: 'g',
  },
  {
    value: 150,
    date: 'g',
  },
  {
    value: 10,
    date: 'g',
  },
  {
    value: 100,
    date: 'g',
  },
  {
    value: 20,
    date: 'g',
  },
  {
    value: 150,
    date: 'g',
  },
  {
    value: 10,
    date: 'g',
  },
  {
    value: 100,
    date: 'g',
  },
  {
    value: 20,
    date: 'd',
  },
  {
    value: 10,
    date: 'd',
  },
  {
    value: 100,
    date: 'd',
  },
  {
    value: 20,
    date: 'd',
  },
]
const data1 = [ 14, 1, 100, 95, 94, 24, 8, 85, 91, 35, 53, 53, 78 ]
  .map((value) => ({ value }))
const data2 = [ 24, 28, 93, 77, 42, 62, 52, 87, 21, 53, 78, 62, 72 ]
  .map((value) => ({ value }))
const xAxisHeight = 30

const barData = [
  {
    data: data1,
    svg: {
      fill: 'rgb(134, 65, 244)',
    },
  },
  {
    data: data2,
  },
]

const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]
const axesSvg = { fontSize: 10, fill: 'grey' };
const verticalContentInset = { top: 10, bottom: 10 }

@inject('firebaseStore')
class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userSelectModalVisible: false,
      userLevel: ''
    }
  }

  setUserLevel(userLevel) {
    this.state.userLevel = userLevel

    if (this.state.userLevel === 'STAFF') {
      this.props.firebaseStore.pushNotificationCustomerNeedsHelp()
      console.log('Staff level set')
    } else if (this.state.userLevel === 'CUSTOMER') {
      this.props.firebaseStore.pushNotificationAdminRespondingToHelp()
      this.props.firebaseStore.updateCustomerStatus('2001', 'ONLINE')
      console.log('Customer level set')
    } else {
      this.props.firebaseStore.pushNotificationCustomerNeedsHelp()
      this.props.firebaseStore.pushNotificationAdminRespondingToHelp()
    }
    this.state.pushListenersCreated = true
    this.state.userSelectModalVisible = false

    this.setState({})
  }

  _renderIcon({ icon, iconSet, color }, size = 50) {
    switch (iconSet) {
      case 'Entypo':
        return <Entypo name={icon} size={size} color="green" />
      case 'SimpleLineIcons':
        return <SimpleLineIcons name={icon} size={size} color="green" />
      case 'FontAwesome':
        return <FontAwesome name={icon} size={size} color="green" />
      case 'Feather':
        return <Feather name={icon} size={size} color="green" />
      case 'Ionicons':
      default:
        return <Ionicons name={icon} size={size} color={color} />
    }
  }

  render() {
    return (
      <Container>
        <HeaderComponent>
          <StatusBar translucent={true} backgroundColor="transparent" />
          <Right>
            <Text adjustsFontSizeToFit numberOfLines={1}>{ this.state.userLevel }</Text>
          </Right>
        </HeaderComponent>

        <View style={{paddingVertical:30}} />

        <View style={{ margin:20 }}>

          <View style={{ flexDirection: 'row'}}>
            <YAxis
              data={yAxisData}
              style={{ }}
              contentInset={verticalContentInset}
              svg={axesSvg}
              />

            <View style={{ flex: 1}}>
            <BarChart
              style={ { height: 200, marginLeft: 10 } }
              data={ barData }
              yAccessor={({ item }) => item.value}
              xAccessor={ ({ item }) => item.date }
              svg={{
                  fill: 'green',
              }}
              contentInset={verticalContentInset}
              { ...this.props }>
                <Grid/>
            </BarChart>
            </View>
          </View>

        <XAxis
          style={{ marginHorizontal: 0 }}
          data={ xAxisData }
          formatLabel={ (value, index) => index }
          contentInset={{ left: 35, right: 18 }}
          svg={{ fontSize: 10, fill: 'black' }}
        />
        </View>

        <View style={{paddingVertical:30}} />


        <Content style={{ backgroundColor: '#f3f2f7' }}>
          <List>
            { this.state.userLevel === 'STAFF' &&
              adminOptions.map((option, index) => (
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
                  <Text>{option.name}</Text>
                </Body>
              </ListItem>
            ))}

            { workingOptions.map((option, index) => (
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
                  <Text>{option.name}</Text>
                </Body>
              </ListItem>
            ))}
            <ListItem itemDivider />
          </List>

          <Modal
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onBackdropPress={ () => { this.state.customerInfoVisible = false } }
            onSwipe={() => { this.state.customerInfoVisible = false }}
            swipeDirection='down'
            backdropColor={'black'}
            backdropOpacity={0.9}
            isVisible={this.state.userSelectModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.')
            }}>

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Button success block onPress={ () => { this.setUserLevel('STAFF') }}>
                <Text>Staff</Text>
              </Button>
              <View style={{paddingVertical:20}} />
              <Button success block onPress={ () => { this.setUserLevel('CUSTOMER') }}>
                <Text>Customer</Text>
              </Button>
            </View>
          </Modal>
        </Content>
      </Container>
    )
  }
}
export default Home
