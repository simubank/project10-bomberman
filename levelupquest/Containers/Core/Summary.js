import React, { Component } from 'react'
import { Image, Alert, StyleSheet, View } from 'react-native'
import { observer, inject } from 'mobx-react'
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
      date: 'Dec 04 2018'
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
                </Body>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Text style={{ marginTop: 5, marginBottom: 5 }}>
                    Category 1: Retail – $100.00
                  </Text>
                </Body>
              </CardItem>
              <CardItem footer bordered>
                <Text>TD Level Up</Text>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </Root>
    )
  }
}

const styles = StyleSheet.create({})
