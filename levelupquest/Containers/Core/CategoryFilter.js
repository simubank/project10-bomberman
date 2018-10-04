import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Container, Content, Text, Button, Body, Right, List, ListItem, CheckBox, Footer } from 'native-base'
import _ from 'lodash'

import HeaderComponent from '../../Components/HeaderComponent'
import styles from './Styles/CategoryFilterStyle'
import footerStyles from './Styles/FooterStyle'

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
      selectedCategories: [],
      filters: this.props.levelUpStore.filters,
      customer: this.props.levelUpStore.customer
    }
  }

  /**
   * Record the user's selected spending categories and population filters
   * and call the backend APIs to retrieve the population spending data.
   */
  async setPopulationCategories() {
    const { age, gender, occupation } = this.state.customer

    // Record the categories that were checked off
    let selectedCategories = _.filter(this.state.categories, category => {
      return category.selected
    })

    // Record the population filters that were checked off
    let selectedFilters = _.filter(this.state.filters, filter => {
      return filter.selected
    })

    this.state.selectedCategories = selectedCategories

    // Make sure that the object list is empty before working with it
    this.props.levelUpStore.resetPopulationCategories()

    // For each savings category selected, call the backend to retrieve the
    // population's average spending amount to be used in the graph later
    for (let category of selectedCategories) {
      let categoryName = category.name

      try {
        await this.props.levelUpStore.getPopulationCategory(categoryName, age, gender, occupation)
      } catch (error) {
        console.error(error)
      }
    }
  }

  async displayResults() {
    await this.setPopulationCategories()
    this.goNext()
  }

  goNext() {
    let params = {
      title: this.state.title,
      amount: this.state.amount,
      deadline: this.state.deadline,
      selectedCategories: this.state.selectedCategories
    }

    this.props.navigation.navigate({
      routeName: 'Graph',
      params: params
    })
  }

  render() {
    const goBack = () => this.props.navigation.goBack()

    return (
      <Container>
        <HeaderComponent goBack={goBack} title="Category Filter" />

        <Content>
          <Text style={styles.title}>Choose categories to focus on:</Text>

          <List style={styles.list}>
            {this.state.categories.map((category, index) => {
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
                      modified[index].selected = !modified[index].selected

                      this.setState({ categories: modified })
                    }}/>
                  <Body>
                    <Text>{index + 1}. {category.name}</Text>
                  </Body>
                  <Right style={{ flex: 1 }}>
                    <Text>${category.average.toFixed(2)}</Text>
                  </Right>
                </ListItem>
              )
            })}
          </List>

          <Text style={styles.title}>Choose filters to apply:</Text>

          <List style={styles.list}>
            {this.state.filters.map((filter, index) => {
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
                      modified[index].selected = !modified[index].selected

                      this.setState({ filters: modified })
                    }}/>
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
