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
    this.state = {}
  }

  render() {
    const goBack = () => this.props.navigation.goBack()
    const { height, width } = Dimensions.get('window')
    const { lat, lng } = this.props.levelUpStore.location

    let url = `https://vigilant-jang-175355.netlify.com/map.html?lat=${lat}&lng=${lng}`

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="Map" />

          <Content>
            <WebView source={{ uri: url }} style={{ height: height - 64, width: width }} />
          </Content>
        </Container>
      </Root>
    )
  }
}
