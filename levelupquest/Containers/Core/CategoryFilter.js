import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'
import { Container, Content, Text, Button, Body, Right, H3, List, ListItem, CheckBox, Footer } from 'native-base'

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
    name: 'Age',
    selected: false
  },
  {
    name: 'Gender',
    selected: false
  },
  {
    name: 'Occupation',
    selected: false
  },
  {
    name: 'Relationship Status',
    selected: false
  },
  {
    name: 'Habitation',
    selected: false
  },
  {
    name: 'Municipality',
    selected: false
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
      categories: this.props.levelUpStore.userCategories,
      filters: FILTERS
    } 
  }

  async getAverageSpending() {
    // reset field selected for each filter
    this.state.filters.forEach(filter => {
      filter.selected = false
    })

    let selectedCategories = _.filter(this.state.categories, category => {
      return category.selected
    })
    let selectedFilters = _.filter(this.state.filters, filter => {
      return filter.selected
    })

    this.props.levelUpStore.userCategories = selectedCategories

    // constant selected filters
    const age = 20
    const gender = 'Male'
    const occupation = 'blah'

    selectedCategories.forEach(async category => {
      let categoryName = category.name

      try {
        await this.props.levelUpStore.getCategorySpending(categoryName, age, gender, occupation)
      } catch (error) {
        console.error(error)
      }
    })

    console.log(this.props.levelUpStore.categories)
  }

  goNext() {
    let params = {
      title: this.state.title,
      amount: this.state.amount,
      deadline: this.state.deadline
    }

    this.props.navigation.navigate({
      routeName: 'Graph',
      params: params
    })
  }

  displayResults() {
    this.getAverageSpending()
    this.goNext()
  }

  render() {
    const goBack = () => this.props.navigation.goBack()

    return (
      <Container>
        <HeaderComponent goBack={goBack} title="Filter Categories" />

        <Content>
          <H3 style={{ margin: 16 }}>Choose categories to focus on:</H3>

          <List style={{ marginBottom: 32 }}>
            {this.state.categories.map((category, index) => {
              return (
                <ListItem
                  key={index}
                  button
                  onPress={() => {
                    let modified = this.state.categories
                    modified[index].selected = !modified[index].selected

                    this.setState({ categories: modified })
                  }}
                >
                  <CheckBox
                    checked={category.selected}
                    onPress={() => {
                      let modified = this.state.categories
                      modified[index].selected = !modified[index].selected

                      this.setState({ categories: modified })
                    }}
                  />
                  <Body>
                    <Text>
                      {index + 1}. {category.name}
                    </Text>
                  </Body>
                  <Right style={{ flex: 1 }}>
                    <Text>${category.average.toFixed(2)}</Text>
                  </Right>
                </ListItem>
              )
            })}
          </List>

          <H3 style={{ margin: 16 }}>Choose filters to apply:</H3>

          <List style={{ marginBottom: 32 }}>
            {this.state.filters.map((filter, index) => {
              return (
                <ListItem
                  key={index}
                  button
                  onPress={() => {
                    let modified = this.state.filters
                    modified[index].selected = !modified[index].selected

                    this.setState({ filters: modified })
                  }}
                >
                  <CheckBox
                    checked={filter.selected}
                    onPress={() => {
                      let modified = this.state.filters
                      modified[index].selected = !modified[index].selected

                      this.setState({ filters: modified })
                    }}
                  />
                  <Body>
                    <Text>{filter.name}</Text>
                  </Body>
                </ListItem>
              )
            })}
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

const styles = StyleSheet.create({})
