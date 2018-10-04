import React, { Component } from 'react'
import { View } from 'react-native'
import { observer, inject } from 'mobx-react'
import { Container, Content, Text, Button, Body, Right, List, ListItem, Root, Spinner, Separator, Icon } from 'native-base'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import styles from './Styles/SettingsStyle'
import HeaderComponent from '../../Components/HeaderComponent'

@inject('levelUpStore')
@observer
export default class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      preferences: this.props.levelUpStore.purchasingPreferences,
      alertFrequency: this.props.levelUpStore.notificationFrequency,
      showSpinner: false
    }
  }

  async analyzePersonality() {
    this.setState({
      showSpinner: true
    })

    await this.props.levelUpStore.initializeSettings()

    this.setState({
      preferences: this.props.levelUpStore.purchasingPreferences,
      alertFrequency: this.props.levelUpStore.notificationFrequency,
      showSpinner: false
    })
  }

  onSliderChange(values) {
    let newValues = []
    newValues[0] = Math.floor(values)

    this.setState({ alertFrequency: newValues })
    this.props.levelUpStore.setNotificationFrequency(newValues)
  }

  frequencyNumToText() {
    let txt = ''

    switch (this.state.alertFrequency[0]) {
      case 0:
        txt = 'Never'
        break
      case 1:
        txt = 'Rarely'
        break
      case 2:
        txt = 'Sometimes'
        break
      case 3:
        txt = 'Regularly'
        break
      case 4:
        txt = 'Frequently'
        break
      case 5:
        txt = 'Always'
        break
    }

    return txt
  }

  render() {
    const goBack = () => this.props.navigation.goBack()

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="Settings" />

          <Content>
            <View style={styles.titleView}>
              <Text style={styles.title}>
                Notification Frequency: {this.frequencyNumToText()}
              </Text>
            </View>

            <View style={styles.sliderView}>
              <MultiSlider
                selectedStyle={{ backgroundColor: 'green' }}
                unselectedStyle={{ backgroundColor: 'silver' }}
                trackStyle={{ height: 3, backgroundColor: 'green' }}
                values={this.state.alertFrequency}
                min={0}
                max={5.01}
                step={0.25}
                onValuesChangeFinish={value => this.onSliderChange(value)}
              />
            </View>

            <View style={styles.buttonView}>
              <Button
                iconLeft
                style={[
                  styles.button,
                  this.state.showSpinner ? { backgroundColor: 'gray' } : { backgroundColor: 'green' }
                ]}
                onPress={() => this.analyzePersonality()}>
                <Icon name="bulb" />
                <Text>Analyze Personality</Text>
              </Button>
            </View>

            <List>
              {this.state.showSpinner && <Spinner color="green" />}

              {this.state.preferences.length && !this.state.showSpinner && (
                <Separator bordered style={{ paddingLeft: 25 }}>
                  <Text>PURCHASING PREFERENCES</Text>
                </Separator>
              )}

              {this.state.preferences.length && !this.state.showSpinner && this.state.preferences.map((preference, index) => {
                return (
                  <ListItem key={index}>
                    <Body>
                      <Text>{preference.name}</Text>
                    </Body>
                    <Right>
                      <Text>{preference.score}</Text>
                    </Right>
                  </ListItem>
                )
              })}
            </List>
          </Content>
        </Container>
      </Root>
    )
  }
}
