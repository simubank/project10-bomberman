import React, { Component } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { observer, inject } from 'mobx-react'
import {
  Container,
  Content,
  Text,
  Right,
  Root,
  Card,
  CardItem,
  Left,
  Thumbnail
} from 'native-base'

import HeaderComponent from '../../Components/HeaderComponent'

@inject('levelUpStore')
@observer
export default class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const goBack = () => this.props.navigation.goBack()
    const customer = this.props.levelUpStore.customer

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="Profile" />

          <Content style={{ padding: 15 }}>
            <Card>
              <CardItem header bordered style={{ paddingTop: 10, paddingBottom: 10 }}>
                <Left>
                  <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 18 }}>{customer.firstName} {customer.lastName}</Text>
                </Left>
                <Right>
                  <Thumbnail style={{ marginRight: 5, width: 50, height: 50, borderRadius: 25 }} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRutaDzv9CjvkuLnXlgR1-D0bHT4as9_TUgOUGLLn_5RbCe4D5ujw' }} />
                </Right>
              </CardItem>

              <CardItem style={{ paddingTop: 20 }}>
                <Left>
                  <Text>Age</Text>
                </Left>
                <Right>
                  <Text style={{ color: 'green', paddingRight: 5 }}>{customer.age}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Gender</Text>
                </Left>
                <Right>
                  <Text style={{ color: 'green', paddingRight: 5 }}>{customer.gender}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Occupation</Text>
                </Left>
                <Right>
                  <Text style={{ color: 'green', paddingRight: 5 }}>{customer.occupation}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Relationship Status</Text>
                </Left>
                <Right>
                  <Text style={{ color: 'green', paddingRight: 5 }}>{customer.relationshipStatus}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Habitation</Text>
                </Left>
                <Right>
                  <Text style={{ color: 'green', paddingRight: 5 }}>{customer.habitation}</Text>
                </Right>
              </CardItem>
              <CardItem style={{ paddingBottom: 20 }}>
                <Left>
                  <Text>Municipality</Text>
                </Left>
                <Right>
                  <Text style={{ color: 'green', paddingRight: 5 }}>{customer.municipality}</Text>
                </Right>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </Root>
    )
  }
}

const styles = StyleSheet.create({})
