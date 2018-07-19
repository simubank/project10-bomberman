import { Body, Button, Container, Content, Header, Left, List, ListItem, Right, Text, Footer, Toast } from 'native-base'
import React, { Component } from 'react'
import { Dimensions, StatusBar, StyleSheet, View, Alert } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { inject, observer } from 'mobx-react'
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import HeaderComponent from '../../Components/HeaderComponent'


const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7)

const yAxisData = [ 14, 1, 100, 95, 94, 24, 8 ]
const xAxisLabels = [ 'Food', 'Entertainment', 'Clothing', 'Transportation', 'Loans', 'Items', 'Drinks' ]

const axesSvg = { fontSize: 10, fill: 'grey' };
const verticalContentInset = { top: 10, bottom: 10 }


@inject('firebaseStore')
export default class Graph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sliderLabel: 'Select a category',
      selectedCategoryIndex: 0,
      selectedCategoryValue: [],
      barData: this.setData(),
      showSlider: false,
      graphMin: 0,
      graphMax: 0,
      originalTotalSpending: 0,
      currentTotalSpending: 0,
      totalSaving: 0,
    }

    this.setGraphMaxAndSum(this.state.barData)
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

  setData() {
    let userData = [ 14, 1, 150, 95, 94, 24, 8 ]
      .map((value, index) => ({
        value,
        svg: {
          fill: randomColor(),
          onPress: () => this.selectGraphCategory(value, index),
        },
        key: `pie-${index}`,
      }))

    let populationData = [ 24, 28, 93, 77, 42, 62, 52]
      .map((value, index) => ({
        value,
        svg: {
          fill: 'lightgrey',
        },
        key: `pie-${index}`,
      }))

    let barData = [
      {
        data: userData,
        svg: {
          fill: 'rgb(134, 65, 244)',
        },
      },
      {
        data: populationData,
      },
    ]
    return barData
  }

  setGraphMaxAndSum(barData) {
    let graphMax = 0
    let originalTotalSpending = 0

    barData[0].data.map(data => {
      originalTotalSpending += data.value

      if (data.value > graphMax){
        graphMax = data.value
      }
    })

    this.state.graphMax = graphMax
    this.state.originalTotalSpending = originalTotalSpending
    this.state.currentTotalSpending = originalTotalSpending
  }

  setCurrentTotalSpending() {
    let currentTotalSpending = 0

    this.state.barData[0].data.map(data => {
      currentTotalSpending += data.value
    })

    let totalSaving = this.state.originalTotalSpending - currentTotalSpending

    this.setState({ currentTotalSpending, totalSaving })
  }

  selectGraphCategory = (value, index) => {
    if(!this.state.showSlider) {
      this.setState({ showSlider: true })
    }

    let selectedCategoryValue = [this.state.barData[0].data[index].value]
    let sliderLabel = xAxisLabels[index]

    this.setState({ selectedCategoryIndex: index })
    this.setState({ selectedCategoryValue, sliderLabel })
  }

  onSliderChange(value) {
    if(value[0] == 0)
      value[0] = 1

    let selectedCategoryValue = value

    let barData = this.state.barData
    barData[0].data[this.state.selectedCategoryIndex].value = value[0]

    this.setState({ barData, selectedCategoryValue })

    this.setCurrentTotalSpending()
  }

  displayResults() {
    Toast.show({
      text: 'Graph',
      buttonText: 'Okay',
      duration: 2000
    })

    setTimeout(() => {
      this.goNext()
    }, 500)
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
          <View style={{alignItems:'center', paddingVertical:30}}>
            <Text>Total spending: {this.state.currentTotalSpending}</Text>
            <Text>Total saving: {this.state.totalSaving}</Text>
          </View>

          <View style={{ margin:20 }}>
            <View style={{ flexDirection: 'row'}}>
              <YAxis
                data={ [this.state.graphMin, this.state.graphMax] }
                style={{ }}
                contentInset={verticalContentInset}
                svg={axesSvg}
                />

              <View style={{ flex: 1}}>
                <BarChart
                  style={ { height: 200, marginLeft: 10 } }
                  data={ this.state.barData }
                  yAccessor={({ item }) => item.value }
                  svg={{
                      fill: 'green',
                  }}
                  contentInset={verticalContentInset}
                  spacingInner={0.2}
                  yMin={this.state.graphMin}
                  yMax={this.state.graphMax}>
                    <Grid/>
                </BarChart>
              </View>
            </View>

            <XAxis
              style={{ marginHorizontal: 0 }}
              data={ yAxisData }
              formatLabel={ (value, index) => index }
              contentInset={{ left: 35, right: 20 }}
              svg={{ fontSize: 10, fill: 'black' }}
              spacingInner={0.2}
            />

            <View style={{paddingVertical:30}} />

            { this.state.showSlider &&
              <View style={{alignItems:'center'}}>
                <Text>{this.state.sliderLabel}</Text>
                <Text>{this.state.selectedCategoryValue[0]}</Text>
                <View style={{paddingVertical:20}} />

                <MultiSlider
                  selectedStyle={{
                    backgroundColor: 'green'
                  }}
                  unselectedStyle={{
                    backgroundColor: 'silver'
                  }}
                  trackStyle={{
                    height: 3,
                    backgroundColor: 'green'
                  }}
                  values={this.state.selectedCategoryValue}
                  min={0}
                  max={this.state.graphMax}
                  step={1}
                  onValuesChangeFinish={value => this.onSliderChange(value)}
                />
              </View>
            }
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
