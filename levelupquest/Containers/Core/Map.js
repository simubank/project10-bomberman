import React, { Component } from 'react'
import { Image, StyleSheet, View, WebView } from 'react-native'
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
export default class Map extends Component {
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
          <HeaderComponent goBack={goBack} title="Map" />

          <Content>
            <WebView
              source={{
                uri:
                  'https://www.google.ca/maps/place/TD+Canada+Trust/@43.6475473,-79.3819741,18.02z/data=!4m5!3m4!1s0x882b34b5669d1e39:0xa2331ecc2935120a!8m2!3d43.6482298!4d-79.3809414'
              }}
              style={{ width: '100%', height: 600 }}
            />
          </Content>
        </Container>
      </Root>
    )
  }
}
