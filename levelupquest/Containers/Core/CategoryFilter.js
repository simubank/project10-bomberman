import React, { Component } from 'react'
import { Image, StyleSheet, View, Alert } from 'react-native'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'
import axios from 'axios'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button,
  Icon, Left, Body, Right, H1, H2, H3, List, ListItem, Title, Fab, Toast, Root,
  CheckBox, Footer } from 'native-base'

import HeaderComponent from '../../Components/HeaderComponent'
import footerStyles from './Styles/FooterStyle'


const CATEGORIES = [
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
]

const FILTERS = [
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

@inject('levelUpStore')
@observer
export default class CategoryFilter extends Component {
  constructor(props) {
    super(props)
    let params = this.props.navigation.state.params

    this.state = {
      title: params.title,
      amount: params.amount,
      deadline: params.deadline,
      categories: [],
      filters: FILTERS
    }

    this.populateCategories()
  }

  async populateCategories() {
    let categories

    try {
      categories = await this.props.levelUpStore.getCategoryList()
    } catch (error) {

      // // If network error, still populate hard coded info
      categories = CATEGORIES
      this.setState({ categories })

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
    let selectedCategories = _.filter(CATEGORIES, category => {
      return category.selected
    })
    let selectedFilters = _.filter(FILTERS, filter => {
      return filter.selected
    })

    Toast.show({
      text: 'Categories: ' + selectedCategories.length + '\nFilters: ' + selectedFilters.length,
      buttonText: 'Okay',
      duration: 2000
    })

    this.goNext()
  }

  render() {
    // let categories = this.props.levelUpStore.categories
    // console.log(categories)

    const goBack = () => this.props.navigation.goBack()

    return (
      <Container>
        <HeaderComponent goBack={goBack} title="Filter Categories" />

        <Content>
          <H3 style={{ margin: 16 }}>Choose categories to focus on:</H3>

          <List style={{ marginBottom: 32 }}>
            {
              this.state.categories.map((category, index) => {
              return (
                <ListItem
                  key={index}
                  button
                  onPress={() => {
                    let modified = this.state.categories
                    modified[index].selected = !modified[index].selected

                    this.setState({ categories: modified })
                  }}>
                  <CheckBox
                    checked={category.selected}
                    onPress={() => {
                      let modified = this.state.categories
                      modified[index].selected = !category.selected

                      this.setState({ categories: modified })
                    }}/>
                  <Body>
                    <Text>
                      {index + 1}. {category.name}
                    </Text>
                  </Body>
                  <Right style={{ flex: 1 }}>
                    <Text>${category.amount.toFixed(2)}</Text>
                  </Right>
                </ListItem>
              )})
          }

          </List>

          <H3 style={{ margin: 16 }}>Choose filters to apply:</H3>

          <List style={{ marginBottom: 32 }}>
            {
              FILTERS.map((filter, index) => {
              return (
                <ListItem
                  key={index}
                  button
                  onPress={() => {
                    let modified = this.state.filters
                    modified[index].selected = !modified[index].selected

                    this.setState({ filters: modified })
                  }}>
                  <CheckBox
                    checked={filter.selected}
                    onPress={() => {
                      let modified = this.state.filters
                      modified[index].selected = !filter.selected

                      this.setState({ filters: modified })
                    }}/>
                  <Body>
                    <Text>{filter.name}</Text>
                  </Body>
                </ListItem>
              )})
            }
          </List>
        </Content>

        <Footer style={footerStyles.footer}>
          <Button full success style={footerStyles.fullBtn} onPress={() => this.displayResults()}>
            <Text style={footerStyles.fullBtnTxt}>CONTINUE</Text>
          </Button>
        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({

})
