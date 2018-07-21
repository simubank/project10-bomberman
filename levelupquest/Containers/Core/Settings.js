import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
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

import HeaderComponent from '../../Components/HeaderComponent'

@inject('levelUpStore')
@observer
export default class Settings extends Component {
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
          <HeaderComponent goBack={goBack} title="Settings" />

          <Content>
            <Button>
              <Text>Connect to Twitter</Text>
            </Button>
          </Content>
        </Container>
      </Root>
    )
  }
}

const styles = StyleSheet.create({})
