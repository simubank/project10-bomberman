import React, { Component } from 'react'
import { Image, StyleSheet, View, Alert } from 'react-native'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'
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
  CheckBox,
  Footer
} from 'native-base'

@inject('firebaseStore')
@observer
export default class CategoryFilter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      categories: [
        {
          name: 'Rent',
          amount: 649.0,
          selected: false
        },
        {
          name: 'Food',
          amount: 284.21,
          selected: false
        },
        {
          name: 'Entertainment',
          amount: 282.44,
          selected: false
        },
        {
          name: 'Retail',
          amount: 207.12,
          selected: false
        },
        {
          name: 'Insurance',
          amount: 100.0,
          selected: false
        }
      ],
      filters: [
        {
          name: 'Age'
        },
        {
          name: 'Gender'
        },
        {
          name: 'Occupation'
        },
        {
          name: 'Relationship Status'
        },
        {
          name: 'Habitation'
        },
        {
          name: 'Municipality'
        }
      ]
    }

    this.initData()

    this.goBack = this.goBack.bind(this)
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

  goHome() {
    this.props.navigation.navigate('Home')
  }

  goNext() {
    this.props.navigation.navigate('Graph')
  }

  displayResults() {
    const categories = _.filter(this.state.categories, category => {
      return category.selected
    })
    const filters = _.filter(this.state.filters, filter => {
      return filter.selected
    })

    Toast.show({
      text: 'Categories: ' + categories.length + '\nFilters: ' + filters.length,
      buttonText: 'Okay',
      duration: 2000
    })

    setTimeout(() => {
      this.goNext()
    }, 500)
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
              <Title style={{ color: '#404040' }}>Category Filter</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="menu" />
              </Button>
            </Right>
          </Header>
          <Content style={{ marginTop: 16, marginBottom: 16 }}>
            <H3 style={{ margin: 16 }}>Choose categories to focus on:</H3>
            <List style={{ marginBottom: 32 }}>
              {this.state.categories.map((category, index) => (
                <ListItem key={index}>
                  <CheckBox
                    checked={category.selected}
                    onPress={() => {
                      let modified = this.state.categories
                      modified[index].selected = !category.selected

                      this.setState({
                        categories: modified
                      })
                    }}
                  />
                  <Body>
                    <Text>
                      {index + 1}. {category.name}
                    </Text>
                  </Body>
                  <Right>
                    <Text>${category.amount.toFixed(2)}</Text>
                  </Right>
                </ListItem>
              ))}
            </List>

            <H3 style={{ margin: 16 }}>Choose filters to apply:</H3>
            <List style={{ marginBottom: 32 }}>
              {this.state.filters.map((filter, index) => (
                <ListItem key={index}>
                  <CheckBox
                    checked={filter.selected}
                    onPress={() => {
                      let modified = this.state.filters
                      modified[index].selected = !filter.selected

                      this.setState({
                        filters: modified
                      })
                    }}
                  />
                  <Body>
                    <Text>{filter.name}</Text>
                  </Body>
                </ListItem>
              ))}
            </List>
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
