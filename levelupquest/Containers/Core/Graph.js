import { Body, Button, Container, Content, Header, Left, List, ListItem, Right, Text, Footer, Toast, Icon, Title } from 'native-base'
import React, { Component } from 'react'
import { Dimensions, StatusBar, StyleSheet, View, Alert } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { inject, observer } from 'mobx-react'
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { NavigationActions, StackActions } from 'react-navigation'
import _ from 'lodash'

import HeaderComponent from '../../Components/HeaderComponent'
import footerStyles from './Styles/FooterStyle'

const randomColor = () => ('#' + ((Math.random() * 0xFFFFFF) << 0).toString(16) + '000000').slice(0, 7)
const axesSvg = { fontSize: 10, fill: 'grey' }
const verticalContentInset = { top: 10, bottom: 10 }

@inject('levelUpStore')
export default class Graph extends Component {
  constructor(props) {
    super(props)
    let params = this.props.navigation.state.params

    this.state = {
      title: params.title,
      amount: params.amount,
      deadline: params.deadline,
      selectedCategories: params.selectedCategories,

      sliderLabel: 'Select a category',
      selectedCategoryIndex: 0,
      selectedCategoryValue: [],
      barData: [],
      showSlider: false,
      graphMin: 0,
      graphMax: 0,

      originalTotalSpending: 0,
      currentTotalSpending: 0,
      totalSaving: 0,
      recommendedSaving: 0,

      userData: [],
      populationData: [],
      xAxisLabels: [],
      numBars: 0
    }

    this.getUserAndPopulationCategories()
    this.setRecommendedSaving()
  }

  setRecommendedSaving() {
    let amount = this.state.amount
    let targetDate = Date.parse(this.state.deadline)
    let currentDate = new Date().getTime()

    let timeDiff = Math.abs(targetDate - currentDate)
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

    this.state.recommendedSaving = (amount / diffDays) * 30.5
  }

  getUserAndPopulationCategories() {
    let userCategories = this.state.selectedCategories
    let populationCategories = this.props.levelUpStore.populationCategories

    this.setUserBarData(userCategories)
    this.setPopulationBarData(populationCategories)
    this.setBarData()

    this.setXAxis(userCategories)
    this.setGraphMaxAndSum()
  }

  setUserBarData(userCategories) {
    let userData = userCategories.map((cat, index) => ({
      value: cat.average,
      svg: {
        fill: randomColor(),
        onPress: () => this.selectGraphCategory(cat, index)
      },
      key: `pie-${index}`
    }))

    this.state.userData = userData
    this.state.numBars = userData.length
  }

  setPopulationBarData(populationCategories) {
    let populationData = populationCategories.map((cat, index) => ({
      value: cat.average,
      svg: {
        fill: 'lightgrey'
      },
      key: `pie2-${index}`
    }))

    this.state.populationData = populationData
  }

  setBarData() {
    let barData = [
      {
        data: this.state.userData,
        svg: {
          fill: 'rgb(134, 65, 244)'
        }
      },
      {
        data: this.state.populationData
      }
    ]

    this.state.barData = barData
  }

  setXAxis(userCategories) {
    let xAxisLabels = userCategories.map(cat => cat.name)
    this.state.xAxisLabels = xAxisLabels
  }

  setGraphMaxAndSum() {
    let graphMax = 0
    let originalTotalSpending = 0

    this.state.barData[0].data.map(data => {
      originalTotalSpending += data.value

      if (data.value > graphMax) {
        graphMax = data.value
      }
    })

    this.state.barData[1].data.map(data => {
      if (data.value > graphMax) {
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
    if (!this.state.showSlider) {
      this.setState({ showSlider: true })
    }

    let selectedCategoryValue = [this.state.barData[0].data[index].value.toFixed(2)]
    let sliderLabel = this.state.xAxisLabels[index]

    this.setState({ selectedCategoryIndex: index })
    this.setState({ selectedCategoryValue, sliderLabel })
  }

  onSliderChange(value) {
    if (value[0] === 0) value[0] = 1

    let selectedCategoryValue = value

    let userData = this.state.userData
    userData[this.state.selectedCategoryIndex].value = value[0]

    this.setState({ userData, selectedCategoryValue })

    this.setBarData()
    this.setCurrentTotalSpending()
  }

  confirmGoalCreate() {
    this.props.levelUpStore.setGoal(this.state.title, this.state.amount, 0, this.state.deadline, this.state.userData, this.state.xAxisLabels)

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          key: 'Home',
          routeName: 'Home'
        })
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  displayResults() {
    Toast.show({
      text: 'New goal created!',
      buttonText: 'Okay',
      duration: 2000
    })

    this.confirmGoalCreate()
  }

  render() {
    const { goBack } = this.props.navigation

    return (
      <Container>
        <HeaderComponent goBack={goBack} title="Graph" />

        <Content style={{ backgroundColor: 'white' }}>
          <View style={{ paddingVertical: 10 }}>
            <List>
              <ListItem>
                <Text style={{ fontSize: 16 }}>Total Spending:</Text>
                <Right style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16 }}>${parseFloat(this.state.currentTotalSpending).toFixed(2)}</Text>
                </Right>
              </ListItem>

              <ListItem>
                <Text style={{ fontSize: 16 }}>Total Savings:</Text>
                <Right style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16 }}>${this.state.totalSaving.toFixed(2)}</Text>
                </Right>
              </ListItem>

              <ListItem style={{ borderBottomColor: 'transparent' }}>
                <Text style={{ fontSize: 16 }}>Recommended Savings:</Text>
                <Right style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16 }}>${this.state.recommendedSaving.toFixed(2)}</Text>
                </Right>
              </ListItem>
            </List>
          </View>

          { this.state.barData[0] && 
            <View style={{ padding: 20, backgroundColor: '#f3f2f7' }}>
              <View style={{ flexDirection: 'row' }}>
                <YAxis
                  data={[this.state.graphMin, this.state.graphMax]}
                  contentInset={verticalContentInset}
                  svg={axesSvg}
                />

                <View style={{ flex: 1 }}>
                  <BarChart
                    style={{ height: 200, marginLeft: 10 }}
                    data={this.state.barData}
                    yAccessor={({ item }) => item.value}
                    svg={{ fill: 'green' }}
                    contentInset={verticalContentInset}
                    spacingInner={0.2}
                    yMin={this.state.graphMin}
                    yMax={this.state.graphMax}
                  >
                    <Grid />
                  </BarChart>
                </View>
              </View>

              <XAxis
                style={{ marginHorizontal: 0 }}
                data={this.state.userData}
                formatLabel={(value, index) => index + 1}
                contentInset={{ left: 55, right: 25 }}
                svg={{ fontSize: 10, fill: 'black' }}
                spacingInner={0.2}
              />
            </View>
          }

          { this.state.showSlider &&
            <View style={{ alignItems: 'center', marginTop: 25 }}>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>{this.state.sliderLabel}</Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>${parseFloat(this.state.selectedCategoryValue[0]).toFixed(2)}</Text>
              <View style={{ paddingVertical: 10 }} />

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
                step={5}
                onValuesChangeFinish={value => this.onSliderChange(value)}
              />
            </View>
          }

        </Content>
        <Footer style={footerStyles.footer}>
          <Button full success style={footerStyles.fullBtn} onPress={() => this.displayResults()}>
            <Text style={footerStyles.fullBtnTxt}>CONTINUE</Text>
          </Button>
        </Footer>
      </Container>
    )
  }
}
