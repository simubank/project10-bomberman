import React, { Component } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { observer, inject } from 'mobx-react'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button,
  Icon, Left, Body, Right, H1, H2, H3, List, ListItem, Title, Fab, Toast, Root
} from 'native-base'

import HeaderComponent from '../../Components/HeaderComponent'


@inject('levelUpStore')
@observer
export default class Rewards extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.initData()
  }

  async initData() {
    try {
      await this.props.levelUpStore.getCustomers()

      console.log(this.props.levelUpStore.customers)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const customers = this.props.levelUpStore.customers
    const goBack = () => this.props.navigation.goBack()

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="Customer List" />

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
