import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
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

    this.state = {
      preferences: []
    }

    this.populatePreferences()
  }

  async populatePreferences() {
    let preferences = await this.props.levelUpStore.getPurchasePreferences()
    
    this.setState({ preferences })
  }

  render() {
    const goBack = () => this.props.navigation.goBack()

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="Settings" />

          <Content>
            <Button style={{ margin: 16 }} onPress={() => this.populatePreferences()}>
              <Text>Analyze Personality</Text>
            </Button>

            <List style={{ marginBottom: 32 }}>
            {this.state.preferences.map((preference, index) => {
              return (
                <ListItem key={index}>
                  <Body>
                    <Text>
                      {index + 1}. {preference.name}
                    </Text>
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
