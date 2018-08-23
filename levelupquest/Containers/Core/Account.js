import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { observer, inject } from 'mobx-react'
import { Container, Content, Text, Right, Root, Card, CardItem, Left, Thumbnail, List, ListItem, Separator } from 'native-base'

import HeaderComponent from '../../Components/HeaderComponent'

const CUSTOMER_ICON_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQysqwVdNUKASMQcQau2kXUBBgpHjRz_YqRJwduBzCQfCIrSFvz'
const ACCOUNT_ICON_URL = 'https://image.flaticon.com/icons/png/512/189/189699.png'

@inject('levelUpStore')
@observer
export default class Account extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  formatText(str) {
    str = str.charAt(0).toUpperCase() + str.slice(1) // capitalize

    if (str === 'Sharingrent') {
      str = 'Sharing Rent'
    }

    return str
  }

  render() {
    const goBack = () => this.props.navigation.goBack()
    const customer = this.props.levelUpStore.customer
    const chequingAccount = this.props.levelUpStore.chequingAccount
    const savingsAccount = this.props.levelUpStore.savingsAccount

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="Account" />

          <Content style={{ padding: 15 }}>
            <Card style={{ marginBottom: 15 }}>
              <CardItem header bordered style={{ paddingTop: 10, paddingBottom: 10 }}>
                <Left>
                  <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 18 }}>Account Info</Text>
                </Left>
                <Right>
                  <Thumbnail style={{ marginRight: 5, width: 50, height: 50, borderRadius: 25 }} source={{ uri: ACCOUNT_ICON_URL }} />
                </Right>
              </CardItem>

              <List>
                <Separator bordered>
                  <Text style={{ fontSize: 12, fontWeight: '700' }}>CHEQUING ACCOUNT</Text>
                </Separator>

                <ListItem>
                  <Left>
                    <Text>Account Number</Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text style={{ color: 'green' }}>{chequingAccount.maskedNumber}</Text>
                  </Right>
                </ListItem>

                <ListItem style={{ borderBottomColor: 'transparent' }}>
                  <Left>
                    <Text>Account Balance</Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text style={{ color: 'green' }}>${chequingAccount.balance.toFixed(2)}</Text>
                  </Right>
                </ListItem>

                <Separator bordered>
                  <Text style={{ fontSize: 12, fontWeight: '700' }}>SAVINGS ACCOUNT</Text>
                </Separator>

                <ListItem>
                  <Left>
                    <Text>Account Number</Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text style={{ color: 'green' }}>{savingsAccount.maskedNumber}</Text>
                  </Right>
                </ListItem>

                <ListItem style={{ borderBottomColor: 'transparent' }}>
                  <Left>
                    <Text>Account Balance</Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text style={{ color: 'green' }}>${savingsAccount.balance.toFixed(2)}</Text>
                  </Right>
                </ListItem>
              </List>
            </Card>

            <Card style={{ marginBottom: 35 }}>
              <CardItem header bordered style={{ paddingTop: 10, paddingBottom: 10 }}>
                <Left>
                  <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 18 }}>{customer.firstName} {customer.lastName}</Text>
                </Left>
                <Right>
                  <Thumbnail style={{ marginRight: 5, width: 50, height: 50, borderRadius: 25 }} source={{ uri: CUSTOMER_ICON_URL }} />
                </Right>
              </CardItem>

              <List>
                <ListItem itemDivider>
                  <Left>
                    <Text>Age</Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text style={{ color: 'green', paddingRight: 5 }}>{customer.age}</Text>
                  </Right>
                </ListItem>

                <ListItem style={{ borderBottomColor: 'transparent' }}>
                  <Left>
                    <Text>Gender</Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text style={{ color: 'green' }}>{customer.gender}</Text>
                  </Right>
                </ListItem>
                
                <ListItem itemDivider>
                  <Left>
                    <Text>Occupation</Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text style={{ color: 'green', paddingRight: 5 }}>{this.formatText(customer.occupation)}</Text>
                  </Right>
                </ListItem>
                
                <ListItem style={{ borderBottomColor: 'transparent' }}>
                  <Left>
                    <Text>Relationship Status</Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text style={{ color: 'green' }}>{this.formatText(customer.relationshipStatus)}</Text>
                  </Right>
                </ListItem>
                
                <ListItem itemDivider>
                  <Left>
                    <Text>Habitation</Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text style={{ color: 'green', paddingRight: 5 }}>{this.formatText(customer.habitation)}</Text>
                  </Right>
                </ListItem>
                
                <ListItem style={{ borderBottomColor: 'transparent' }}>
                  <Left>
                    <Text>Municipality</Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text style={{ color: 'green' }}>{customer.municipality}</Text>
                  </Right>
                </ListItem>
              </List>
            </Card>
          </Content>
        </Container>
      </Root>
    )
  }
}

const styles = StyleSheet.create({})
