import React, { Component } from 'react'
import { Image, StyleSheet, View, Alert } from 'react-native'
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
  Root,
  Form,
  Item,
  Input,
  Label,
  Footer
  // DatePicker
} from 'native-base'

@inject('firebaseStore')
@observer
export default class NewGoal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      goal: '',
      amount: 0,
      deadline: new Date()
    }

    this.initData()

    this.goBack = this.goBack.bind(this)
    this.goNext = this.goNext.bind(this)
    this.setDate = this.setDate.bind(this)
    this.displayResults = this.displayResults.bind(this)
  }

  async initData() {
    try {
      await this.props.firebaseStore.getCustomers()

      console.log(this.props.firebaseStore.customers)
    } catch (error) {
      console.log(error)
    }
  }

  goBack() {
    this.props.navigation.pop()
  }

  goNext() {
    this.props.navigation.navigate('CategoryFilter')
  }

  setDate(newDate) {
    this.setState({ deadline: newDate })
  }

  displayResults() {
    Alert.alert(
      'Goal',
      'Goal: ' + this.state.goal + '\nAmount: ' + this.state.amount + '\nDeadline: ' + this.state.deadline
    )

    this.goNext()
  }

  render() {
    // const customers = this.props.firebaseStore.customers

    return (
      <Root>
        <Container>
          <Header>
            <Left>
              <Button transparent>
                <Icon style={{ fontSize: 24, marginLeft: 8 }} name="arrow-back" onPress={this.goBack} />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: '#404040' }}>New Goal</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="menu" />
              </Button>
            </Right>
          </Header>
          <Content>
            <Form>
              <Item floatingLabel>
                <Label>Goal</Label>
                <Input onChangeText={newGoal => this.setState({ goal: newGoal })} />
              </Item>
              <Item floatingLabel>
                <Label>Amount</Label>
                <Input onChangeText={newAmount => this.setState({ amount: newAmount })} />
              </Item>
              {/* <Item floatingLabel>
                <Label>Deadline</Label>
                <Input onChangeText={newDeadline => this.setState({ deadline: newDeadline })} />
              </Item> */}
              {/* <DatePicker
                defaultDate={new Date(2018, 4, 4)}
                minimumDate={new Date(2018, 1, 1)}
                maximumDate={new Date(2018, 12, 31)}
                locale={'en'}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                placeHolderText="Select Date"
                textStyle={{ color: 'green' }}
                placeHolderTextStyle={{ color: '#d3d3d3' }}
                onDateChange={this.setDate}
              />
              <Text>Date: {this.state.deadline.toString().substr(4, 12)}</Text> */}
            </Form>
          </Content>
          <Footer style={{ position: 'relative', top: 5 }}>
            <Button full success style={styles.fullBtn} onPress={() => this.displayResults()}>
              <Text style={styles.fullBtnTxt}>CONTINUE</Text>
            </Button>
          </Footer>
        </Container>
      </Root>
    )
  }
}

const styles = StyleSheet.create({
  fullBtn: {
    height: 50,
    width: '100%'
  },
  fullBtnTxt: {
    fontSize: 18,
    letterSpacing: 1
  }
})
