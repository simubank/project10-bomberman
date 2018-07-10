import React, { Component } from 'react'
import { Image, StatusBar } from 'react-native'
import { Header, Text, Left, Right, Body, Button, Icon } from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'

import styles from './Styles/HeaderComponentStyle'
import _ from 'lodash'

const logo = require('../Images/apple-icon.png')

class HeaderComponent extends Component {
  constructor(props) {
    super(props)

    if (this.props.goBack) {
      this.goBack = _.debounce(this.props.goBack, 250, { trailing: true })
    }
  }

  render() {
    return (
      <Header style={styles.header}>
        <StatusBar translucent backgroundColor="transparent" />
        <Left style={styles.left}>
          {this.props.goBack && (
            <Button transparent style={styles.backButton} onPress={() => this.goBack()}>
              <Icon name="arrow-back" style={styles.backIcon}  />
            </Button>
          )}
        </Left>
        <Body style={styles.body}>
          {this.props.title ? (
            <Text style={styles.title}>{this.props.title}</Text>
          ) : (
            <Image source={logo} style={styles.tdLogo} />
          )}
        </Body>
        <Right style={styles.right}>{this.props.children}</Right>
      </Header>
    )
  }
}

export default HeaderComponent
