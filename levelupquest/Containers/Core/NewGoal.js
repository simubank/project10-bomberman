import React, { Component } from 'react'
import { View } from 'react-native'
import { observer, inject } from 'mobx-react'
import {
  Container,
  Content,
  Text,
  Button,
  Toast,
  Root,
  Form,
  Item,
  Input,
  Label,
  Footer,
  DatePicker
} from 'native-base'

import HeaderComponent from '../../Components/HeaderComponent'
import footerStyles from './Styles/FooterStyle'

@inject('levelUpStore')
@observer
export default class NewGoal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      amount: 0,
      deadline: new Date()
    }
  }

  goNext() {
    let params = {
      title: this.state.title,
      amount: this.state.amount,
      deadline: this.state.deadline
    }

    this.props.navigation.navigate({
      routeName: 'CategoryFilter',
      params: params
    })
  }

  setDate(newDate) {
    this.setState({ deadline: newDate })
  }

  displayResults() {
    Toast.show({
      text:
        'Goal: ' +
        this.state.title +
        '\nAmount: ' +
        this.state.amount +
        '\nDeadline: ' +
        this.state.deadline.toString().substr(4, 12),
      buttonText: 'Okay',
      duration: 2000
    })

    this.goNext()
  }

  render() {
    // const customers = this.props.levelUpStore.customers
    const goBack = () => this.props.navigation.goBack()

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="New Goal" />

          <Content>
            <Form>
              <Item floatingLabel>
                <Label>Goal</Label>
                <Input onChangeText={newTitle => this.setState({ title: newTitle })} />
              </Item>
              <Item floatingLabel>
                <Label>Amount</Label>
                <Input onChangeText={newAmount => this.setState({ amount: newAmount })} />
              </Item>

              <View style={{ margin: 20 }}>
                <DatePicker
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
                <Text>Date: {this.state.deadline.toString().substr(4, 12)}</Text>
              </View>
            </Form>
          </Content>

          <Footer style={footerStyles.footer}>
            <Button full success style={footerStyles.fullBtn} onPress={() => this.displayResults()}>
              <Text style={footerStyles.fullBtnTxt}>CONTINUE</Text>
            </Button>
          </Footer>
        </Container>
      </Root>
    )
  }
}
