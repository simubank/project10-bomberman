import { Body, Button, Container, Content, Header, Left, List, ListItem, Right, Text, Footer } from 'native-base'
import React, { Component } from 'react'
import { Dimensions, StatusBar, StyleSheet, View, Alert } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { inject, observer } from 'mobx-react'
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'

import HeaderComponent from '../../Components/HeaderComponent'

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
export default class Graph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userSelectModalVisible: false,
      userLevel: ''
    }
  }

  goBack() {
    this.props.navigation.pop()
  }

  goHome() {
    this.props.navigation.navigate('Home')
  }

  goNext() {
    this.props.navigation.navigate('Summary')
  }

  displayResults() {
    Alert.alert('Graph', 'Summary')

    this.goNext()
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

        <Content style={{ backgroundColor: '#f3f2f7' }}>
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
                spacingInner={0.2}
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
            spacingInner={0.2}
          />
          </View>

          <View style={{paddingVertical:30}} />
        </Content>
        <Footer style={{ position: 'relative', top: 5 }}>
          <Button full success style={styles.fullBtn} onPress={() => this.displayResults()}>
            <Text style={styles.fullBtnTxt}>CONTINUE</Text>
          </Button>
        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  fullBtn: {
    height: 50,
    width: '100%'
  },
  fullBtnTxt: {
    fontSize: 18,
    letterSpacing: 1
  }
})
