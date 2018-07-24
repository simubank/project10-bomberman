import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { observer, inject } from 'mobx-react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { Container, Content, Text, Button, Body, Right, List, ListItem, Root } from 'native-base'

import HeaderComponent from '../../Components/HeaderComponent'

@inject('levelUpStore')
@observer
export default class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      preferences: [],
      alertFrequency: [0]
    }
  }

  async populatePreferences() {
    let preferences = await this.props.levelUpStore.getPurchasePreferences()

    this.setState({ preferences })
    this.changeFrequencyBasedOnPreferences()
  }

  changeFrequencyBasedOnPreferences() {
    let sum = 0

    this.state.preferences.forEach(preference => {
      sum += preference.score
    })

    sum -= 1.5

    let newValues = [0]
    newValues[0] = sum

    this.setState({ alertFrequency: newValues })
  }

  onSliderChange(values) {
    let newValues = [0]
    newValues[0] = values[0]
    this.setState({ alertFrequency: newValues })
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
            <Text style={{ margin: 16, fontSize: 18 }}>Notification Frequency: {this.frequencyNumToText()}</Text>

            <View style={{ margin: 16, marginLeft: 32 }}>
              <MultiSlider
                selectedStyle={{
                  backgroundColor: 'green'
                }}
                unselectedStyle={{
                  backgroundColor: 'silver'
                }}
                trackStyle={{
                  height: 3,
                  backgroundColor: 'green'
                }}
                values={this.state.alertFrequency}
                min={0}
                max={5}
                step={1}
                onValuesChangeFinish={value => this.onSliderChange(value)}
              />
            </View>

            <Button style={{ marginLeft: 16 }} onPress={() => this.populatePreferences()}>
              <Text>Analyze Personality</Text>
            </Button>

            <List style={{ marginTop: 16, marginBottom: 32 }}>
              {this.state.preferences.map((preference, index) => {
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

const styles = StyleSheet.create({})
