import React, { Component } from 'react'
import { Image, StyleSheet, View, Alert } from 'react-native'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'
import axios from 'axios'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button,
  Icon, Left, Body, Right, H1, H2, H3, List, ListItem, Title, Fab, Toast, Root,
  CheckBox, Footer } from 'native-base'

import HeaderComponent from '../../Components/HeaderComponent'


@inject('levelUpStore')
@observer
export default class CategoryFilter extends Component {
  constructor(props) {
    super(props)
    let params = this.props.navigation.state.params

    this.state = {
      categoriesConstant: [
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
      ],
      title: params.title,
      amount: params.amount,
      deadline: params.deadline
    }

    this.populateCategories()
  }

  async populateCategories() {
    try {
      await this.props.levelUpStore.getCategoryList()
    } catch (error) {
      console.error(error)
    }
  }

  goNext() {
    let params = {
      title: this.state.title,
      amount: this.state.amount,
      deadline: this.state.deadline
      //TODO: send the object returned by the API call
    }

    this.props.navigation.navigate({
      routeName: 'Graph',
      params: params
    })
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

    this.goNext()
  }

  render() {
    const categories = this.props.levelUpStore.categories
    console.log(categories)

    const goBack = () => this.props.navigation.goBack()

    return (
      <Root>
        <Container>
          <HeaderComponent goBack={goBack} title="Filter Categories" />

          <Content style={{ marginTop: 16, marginBottom: 16 }}>
            <H3 style={{ margin: 16 }}>Choose categories to focus on:</H3>
            <List style={{ marginBottom: 32 }}>
              {categories.map((category, index) => (
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
                  <Right style={{ flex: 1 }}>
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
