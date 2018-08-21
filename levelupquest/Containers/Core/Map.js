import React, { Component } from 'react'
import { WebView } from 'react-native'
import { observer, inject } from 'mobx-react'
import { Container, Content, Root } from 'native-base'
import Dimensions from 'Dimensions'

import HeaderComponent from '../../Components/HeaderComponent'

@inject('levelUpStore')
@observer
export default class Map extends Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false
    }

    // this.getLocation()
  }

  getLocation() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    function success(pos) {
      var crd = pos.coords

      console.log('Your current position is:')
      console.log(`Latitude : ${crd.latitude}`)
      console.log(`Longitude: ${crd.longitude}`)
      console.log(`More or less ${crd.accuracy} meters.`)
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`)
    }

    navigator.geolocation.getCurrentPosition(success, error, options)
  }

  render() {
    const goBack = () => this.props.navigation.goBack()
    const { height, width } = Dimensions.get('window')

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="Map" />

          <Content>
            <WebView
              source={{ uri: 'https://vigilant-jang-175355.netlify.com/map.html' }}
              style={{ height: height - 64, width: width }}
            />
          </Content>
        </Container>
      </Root>
    )
  }
}
