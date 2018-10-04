import React, { Component } from 'react'
import { View } from 'react-native'
import { observer, inject } from 'mobx-react'
import { Container, Content, Card, CardItem, Text, Button, Icon, Left, Body,
  Right, List, ListItem, Fab, Root } from 'native-base'
import * as ProgressTracker from 'react-native-progress'

import styles from './Styles/ProgressStyle'
import MakeItRainComponent from '../../Components/MakeItRainComponent'
import HeaderComponent from '../../Components/HeaderComponent'

@inject('levelUpStore')
@observer
export default class Progress extends Component {
  constructor(props) {
    super(props)

    this.state = {
      saved: 0.0,
      cashBack: 0.0,
      categories: this.props.levelUpStore.goal.categories,
      rain: false,
      fabActive: true
    }
  }

  /**
   * Used for demos to mimic fast fowarding a month and the app user having
   * generated a month of transactions.
   */
  onFastForwardClicked() {
    // Randomly generate monthly spendings
    const min = 50
    const max = 200

    // Map the spending amount into the category object
    let modified = this.state.categories.map(category => {
      let amountIncrease = Math.floor(Math.random() * (max - min + 1)) + min
      category.current = amountIncrease

      return category
    })

    // Update the state so that the new amounts show
    this.setState({ categories: modified })
  }

  /**
   * Deposit the amount of money saved this month by calling the API and transferring
   * the money from the user's chequeings to the savings account. Run animation if
   * the savings goal has been achieved.
   */
  onDepositSavingsClicked(amount) {
    let sum = 0

    // Get the amount difference for each category between spending goal and
    // actual amount spent
    this.state.categories.forEach(category => {
      let diff = this.calculateDifference(category)
      sum += parseFloat(diff)
    })

    // Update cash back amount
    let cashBackAmount = sum * 0.01

    // Call API to transfer the amount of money from the chequeings to savings accounts
    this.depositToAccount(sum)

    let newAmount = this.state.saved + sum

    // Check if goal has been reached. If yes, make cash rain!! (animation)
    if (newAmount >= amount) {
      this.setState({
        saved: this.props.levelUpStore.goal.amount,
        rain: true
      })

      return
    }

    // If the goal has not been reached...
    this.setState(prevState => ({
      saved: prevState.saved + sum + cashBackAmount,
      cashBack: prevState.cashBack + cashBackAmount
    }))

    // Reset current spendings for each category in preparation for next month
    let modified = this.state.categories.map(category => {
      category.current = 0

      return category
    })

    this.setState({ categories: modified })
  }

  /**
   * Used when rendering the spending amounts in each category. Display the amount
   * as green if it was under the target spending amount. Display the amount as red
   * if it was above the target.
   */
  renderAmountSpentPerCategory(currentAmount, goal) {
    if (currentAmount > goal) {
      return <Text style={{ marginBottom: 4, color: 'red' }}>${currentAmount.toFixed(2)}</Text>
    } else {
      return <Text style={{ marginBottom: 4, color: 'green' }}>${currentAmount.toFixed(2)}</Text>
    }
  }

  /**
   * Render the category icon based on name
   */
  getCategoryIcon(name) {
    let icon = 'pricetags'

    if (name === 'Fast food') {
      icon = 'cafe'
    } else if (name === 'Retail') {
      icon = 'cart'
    } else if (name === 'Entertainment') {
      icon = 'desktop'
    } else if (name === 'Utility bill') {
      icon = 'flash'
    } else if (name === 'Insurance') {
      icon = 'speedometer'
    }

    return icon
  }

  /**
   * Used to update the progress bar percentage
   */
  calculatePercentage(amount) {
    if (this.state.saved === 0) {
      return 0
    } else {
      return ((this.state.saved * 100) / amount).toFixed(0)
    }
  }

  /**
   * Used to calculate the difference between actual spending and the goal
   */
  calculateDifference(category) {
    if (category.average.value >= category.current) {
      return (category.average.value - category.current).toFixed(2)
    } else {
      return (0).toFixed(2)
    }
  }

  /**
   * API call to deposit money between accounts
   */
  async depositToAccount(amount) {
    let result = await this.props.levelUpStore.transferMoneyFromChequingToSavings(amount)

    if (result.statusCode === 200) {
      await this.props.levelUpStore.getAccountInformation()
    }
  }

  render() {
    const goBack = () => this.props.navigation.goBack()
    const { goal } = this.props.levelUpStore

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="Progress" />

          <Content padder>
            <Card>
              <CardItem header bordered>
                <View style={styles.cardItemHeader}>
                  <View>
                    <Text style={styles.cardItemHeaderText}>{goal.title}</Text>
                  </View>
                  <View>
                    <Text note style={styles.cardItemHeaderNote}>
                      Target Date: {goal.deadline.toString().substr(4, 12)}
                    </Text>
                  </View>
                </View>
              </CardItem>

              <CardItem bordered>
                <Text style={styles.progressBarText}>Progress: {this.calculatePercentage(goal.amount)}%</Text>
                <ProgressTracker.Bar
                  progress={this.calculatePercentage(goal.amount) / 100}
                  width={180}
                  height={10}
                  color={'green'}/>
              </CardItem>

              <CardItem bordered>
                <Body>
                  {this.state.rain && <MakeItRainComponent />}
                  <Text style={styles.bodyText}>Goal Amount: ${goal.amount.toFixed(2)}</Text>
                  <Text style={styles.bodyText}>Total Savings: ${this.state.saved.toFixed(2)}</Text>
                  <Text style={styles.bodyText}>
                    Cash Back Earned: ${this.state.cashBack.toFixed(2)}
                  </Text>
                </Body>
              </CardItem>

              <List>
                {goal.categories.map((category, index) => (
                  <ListItem avatar key={index}>
                    <Left>
                      <Button iconLeft transparent style={styles.icon}>
                        <Icon
                          name={this.getCategoryIcon(category.name)}
                          style={{ color: category.average.value >= category.current ? 'green' : 'red', fontSize: 30 }}
                        />
                      </Button>
                    </Left>
                    <Body>
                      <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>{category.name}</Text>
                      <Text style={{ marginBottom: 4, fontSize: 14 }}>Limit: ${category.average.value.toFixed(2)}</Text>
                      <Text style={{ marginBottom: 4, fontSize: 14 }}>
                        Savings: ${this.calculateDifference(category)}
                      </Text>
                    </Body>
                    <Right>{this.renderAmountSpentPerCategory(category.current, category.average.value)}</Right>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Content>

          <Fab
            active={this.state.active}
            direction="left"
            containerStyle={{}}
            style={{ backgroundColor: 'turquoise' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>

            <Icon name="md-add" />
            <Button style={{ backgroundColor: 'green' }} onPress={() => this.onDepositSavingsClicked(goal.amount)}>
              <Icon name="logo-usd" />
            </Button>
            <Button style={{ backgroundColor: 'orange' }} onPress={() => this.onFastForwardClicked()}>
              <Icon name="ios-fastforward" />
            </Button>

          </Fab>
        </Container>
      </Root>
    )
  }
}
