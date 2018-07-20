import React, { Component } from 'react'
import { Image, StyleSheet, View } from 'react-native'
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
export default class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {}

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
    const customers = this.props.firebaseStore.customers

    return (
      <Root>
        <Container>
          <Header>
            <Left>
              <Button transparent>
                <Icon style={{ fontSize: 24, marginLeft: 8 }} name="arrow-back" onPress={() => this.goBack()} />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: '#404040' }}>Customer List</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="menu" />
              </Button>
            </Right>
          </Header>
          <Content>
            <List>
              {customers.map((customer, index) => (
                <ListItem avatar key={index}>
                  <Left>
                    <Button
                      rounded
                      light={customer.status === 'OFFLINE'}
                      info={customer.status === 'ONLINE'}
                      success={customer.status === 'CHECKED_OUT'}
                      warning={customer.status === 'NEED_HELP'}
                    >
                      <Text>{'   '}</Text>
                    </Button>
                  </Left>
                  <Body>
                    <Text style={{ marginBottom: 4 }}>{customer.name}</Text>
                    <Text style={{ marginBottom: 4, fontSize: 14 }}>
                      {customer.gender} {customer.age} ({customer.isMarried ? 'Married' : 'Not Married'})
                    </Text>
                    {customer.purchases.map((purchase, index) => (
                      <Text note key={index}>
                        {purchase.productName}
                      </Text>
                    ))}
                  </Body>
                  <Right>
                    <Text style={{ marginBottom: 4 }}>{customer.entryTime}</Text>
                    <Text style={{ marginBottom: 4, fontSize: 14 }}>{customer.location}</Text>
                    <Text note>{customer.customerSince}</Text>
                  </Right>
                </ListItem>
              ))}
            </List>
          </Content>
        </Container>
      </Root>
    )
  }
}

const styles = StyleSheet.create({})
