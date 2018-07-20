import React, { Component } from 'react'
import { Image, Alert, StyleSheet, View } from 'react-native'
import { observer, inject } from 'mobx-react'
import * as Progress from 'react-native-progress'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button,
  Icon, Left, Body, Right, H1, H2, H3, List, ListItem, Title, Fab, Toast, Root
} from 'native-base'

import MakeItRainComponent from '../../Components/MakeItRainComponent'
import HeaderComponent from '../../Components/HeaderComponent'


const TEST_CATEGORIES = [
  {
    name: 'Food',
    amount: 284.21,
    selected: false,
    target: 200.0,
    current: 131.34,
    status: 'UNDER'
  },
  {
    name: 'Entertainment',
    amount: 282.44,
    selected: false,
    target: 100.0,
    current: 93.21,
    status: 'NEAR'
  },
  {
    name: 'Retail',
    amount: 207.12,
    selected: false,
    target: 150.0,
    current: 195.32,
    status: 'ABOVE'
  }
]

@inject('levelUpStore')
@observer
export default class Summary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: 'Vacation',
      amount: 2000.0,
      date: 'Dec 04 2018',
      saved: 600.0,
      percentage: 0.3,
      categories: TEST_CATEGORIES,
      rain: false,
      fabActive: true,
    }

    this.initData()
  }

  async initData() {
    try {
      await this.props.levelUpStore.getCustomers()
      // console.log(this.props.levelUpStore.customers)
    } catch (error) {
      // console.log(error)
    }
  }

  onFastForwardClicked() {
    console.log('FAST FORWARDDDDDD')
    /*TODO: FAST FORWARDDDDDD
        - generate mock data for category spending values
        - calculate total saved over the period of time
    */
  }

  onDepositSavingsClicked() {
    console.log('HERE COMES THE MONEYYYYY')
    /*TODO:
        - total savings = 0
        - update progress bar
        - rain money
    */
  }

  render() {
    const goBack = () => this.props.navigation.goBack()

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="Summary" />

          <Content padder>
            <Card>
              <CardItem header bordered>
                <Text>{this.state.title}</Text>
              </CardItem>
              <CardItem bordered>
                <Body>
                  {this.state.rain && <MakeItRainComponent />}
                  <Text style={{ marginTop: 5, marginBottom: 5 }}>Amount: ${this.state.amount.toFixed(2)}</Text>
                  <Text style={{ marginTop: 5, marginBottom: 5 }}>Date: {this.state.date}</Text>
                  <Text style={{ marginTop: 5, marginBottom: 5 }}>Saved: ${this.state.saved.toFixed(2)}</Text>
                </Body>
              </CardItem>
              <List>
                {this.state.categories.map((category, index) => (
                  <ListItem avatar key={index}>
                    <Left>
                      <Button
                        rounded
                        info={category.status === 'NEAR'}
                        success={category.status === 'UNDER'}
                        warning={category.status === 'ABOVE'}
                      >
                        <Text>{'   '}</Text>
                      </Button>
                    </Left>
                    <Body>
                      <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>{category.name}</Text>
                      <Text style={{ marginBottom: 4, fontSize: 14 }}>
                        ${category.amount.toFixed(2)} {' > '} ${category.target.toFixed(2)}
                      </Text>
                    </Body>
                    <Right>
                      <Text style={{ marginBottom: 4 }}>${category.current.toFixed(2)}</Text>
                    </Right>
                  </ListItem>
                ))}
              </List>
              <CardItem footer bordered>
                <Left>
                  <Text>Progress: {this.state.percentage * 100}%</Text>
                </Left>
                <Right>
                  <Progress.Bar progress={this.state.percentage} width={180} height={10} />
                </Right>
              </CardItem>
            </Card>

            <View style={{ paddingVertical: 30 }} />

            <Button danger onPress={() => this.setState({ rain: !this.state.rain })}>
              <Text>Psst... Lily Press Me</Text>
            </Button>
          </Content>

          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: 'turquoise' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="md-add" />
            <Button style={{ backgroundColor: 'green' }} onPress={() => this.onDepositSavingsClicked()}>
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

const styles = StyleSheet.create({})
