import React, { Component } from 'react'
import { Image, Alert, StyleSheet, View } from 'react-native'
import { observer, inject } from 'mobx-react'
import * as Progress from 'react-native-progress'

import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  H1,
  H2,
  H3,
  List,
  ListItem,
  Title,
  Fab,
  Toast,
  Root
} from 'native-base'

@inject('firebaseStore')
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
      categories: [
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
    }

    this.initData()

    this.goBack = this.goBack.bind(this)
  }

  async initData() {
    try {
      await this.props.firebaseStore.getCustomers()

      console.log(this.props.firebaseStore.customers)
    } catch (error) {
      console.log(error)
    }
  }

  goBack() {
    this.props.navigation.pop()
  }

  goHome() {
    this.props.navigation.navigate('Home')
  }

  goNext() {
    this.props.navigation.navigate('Home')
  }

  displayResults() {
    Toast.show({
      text: 'Summary',
      buttonText: 'Okay',
      duration: 2000
    })

    setTimeout(() => {
      this.goNext()
    }, 500)
  }

  render() {
    // const customers = this.props.firebaseStore.customers

    return (
      <Root>
        <Container>
          <Header>
            <Left>
              <Button transparent>
                <Icon style={{ fontSize: 24, marginLeft: 8 }} name="arrow-back" onPress={this.goBack} />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: '#404040' }}>Summary</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="menu" />
              </Button>
            </Right>
          </Header>
          <Content padder>
            <Card>
              <CardItem header bordered>
                <Text>{ this.state.title }</Text>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Text style={{ marginTop: 5, marginBottom: 5 }}>
                    Amount: ${ this.state.amount.toFixed(2) }
                  </Text>
                  <Text style={{ marginTop: 5, marginBottom: 5 }}>
                    Date: { this.state.date }
                  </Text>
                  <Text style={{ marginTop: 5, marginBottom: 5 }}>
                    Saved: ${ this.state.saved.toFixed(2) }
                  </Text>
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
                  <Text>Progress: { this.state.percentage * 100 }%</Text>
                </Left>
                <Right>
                  <Progress.Bar progress={this.state.percentage} width={180} height={10} />
                </Right>
                {/* <Progress.Pie progress={0.4} size={50} />
                <Progress.Circle size={30} indeterminate={true} />
                <Progress.CircleSnail color={['red', 'green', 'blue']} /> */}
              </CardItem>
            </Card>
          </Content>
        </Container>
      </Root>
    )
  }
}

const styles = StyleSheet.create({})
