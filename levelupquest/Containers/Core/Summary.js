import React, { Component } from 'react'
import { Image, Alert, StyleSheet, View, Dimensions } from 'react-native'
import { observer, inject } from 'mobx-react'
import * as Progress from 'react-native-progress'

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




import moneyFront from '../../Images/money20-front.png';
import moneyBack from '../../Images/money20-back.png';
import * as Animatable from 'react-native-animatable';

const MONEY_DIMENSIONS = { width: 200, height: 52 };
const SCREEN_DIMENSIONS = Dimensions.get('window');
const WIGGLE_ROOM = 50;

const FlippingImage = ({ back = false, delay, duration = 1000, source, style = {} }) => (
  <Animatable.Image
    animation={{
      from: { rotateX: back ? '0deg' : '180deg', rotate: !back ? '180deg' : '0deg' },
      to: { rotateX: back ? '360deg' : '-180deg', rotate: !back ? '180deg' : '0deg' },
    }}
    duration={duration}
    delay={delay}
    easing="linear"
    iterationCount="infinite"
    useNativeDriver
    source={source}
    style={{
      ...style,
      backfaceVisibility: 'hidden',
    }}
  />
);

const Swinging = ({ amplitude, rotation = 7, delay, duration = 700, children }) => (
  <Animatable.View
    animation={{
      0: {
        translateX: -amplitude,
        translateY: -amplitude * 0.8,
        rotate: `${rotation}deg`,
      },
      0.5: {
        translateX: 0,
        translateY: 0,
        rotate: '0deg',
      },
      1: {
        translateX: amplitude,
        translateY: -amplitude * 0.8,
        rotate: `${-rotation}deg`,
      },
    }}
    delay={delay}
    duration={duration}
    direction="alternate"
    easing="ease-in-out"
    iterationCount="infinite"
    useNativeDriver
  >
    {children}
  </Animatable.View>
);

const Falling = ({ duration, delay, style, children }) => (
  <Animatable.View
    animation={{
      from: { translateY: -MONEY_DIMENSIONS.height - WIGGLE_ROOM },
      to: { translateY: SCREEN_DIMENSIONS.height + WIGGLE_ROOM },
    }}
    duration={duration}
    delay={delay}
    easing={t => Math.pow(t, 1.7)}
    iterationCount="infinite"
    useNativeDriver
    style={style}
  >
    {children}
  </Animatable.View>
);

const randomize = max => Math.random() * max;

const range = count => {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(i);
  }
  return array;
};

const MakeItRain = ({ children }) => (
  <View style={{ flex: 1 }}>
    {children}
  </View>
);


@inject('firebaseStore')
@observer
export default class Summary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: 'Vacation',
      amount: 2000.0,
      date: 'Dec 04 2018',
      saved: 600.0,
      percentage: 0.3,
      categories: [
        {
          name: 'Food',
          amount: 284.21,
          selected: false,
          target: 200.0,
          current: 131.34,
          status: 'UNDER'
        },
        {
          name: 'Entertainment',
          amount: 282.44,
          selected: false,
          target: 100.0,
          current: 93.21,
          status: 'NEAR'
        },
        {
          name: 'Retail',
          amount: 207.12,
          selected: false,
          target: 150.0,
          current: 195.32,
          status: 'ABOVE'
        }
      ],
      rain: false,
    }

    this.initData()

    this.goBack = this.goBack.bind(this)
  }

  async initData() {
    try {
      await this.props.firebaseStore.getCustomers()
      // console.log(this.props.firebaseStore.customers)
    } catch (error) {
      // console.log(error)
    }
  }

  goBack() {
    this.props.navigation.pop()
  }

  goHome() {
    this.props.navigation.navigate('Home')
  }

  goNext() {
    this.props.navigation.navigate('Home')
  }

  displayResults() {
    Toast.show({
      text: 'Summary',
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
              <Title style={{ color: '#404040' }}>Summary</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="menu" />
              </Button>
            </Right>
          </Header>
          <Content padder>

          {this.state.rain &&
            <MakeItRain>
              {range(15)
                .map(i => randomize(1000))
                .map((flipDelay, i) => (
                  <Falling
                    key={i}
                    duration={3000}
                    delay={i * (3000 / 15)}
                    style={{
                      position: 'absolute',
                      paddingHorizontal: WIGGLE_ROOM,
                      left: randomize(SCREEN_DIMENSIONS.width - MONEY_DIMENSIONS.width) - WIGGLE_ROOM,
                    }}
                  >
                    <Swinging amplitude={MONEY_DIMENSIONS.width / 5} delay={randomize(3000)}>
                      <FlippingImage source={moneyFront} delay={flipDelay} />
                      <FlippingImage
                        source={moneyBack}
                        delay={flipDelay}
                        back
                        style={{ position: 'absolute' }}
                      />
                    </Swinging>
                  </Falling>
                ))}
            </MakeItRain>
          }

            <Card>
              <CardItem header bordered>
                <Text>{ this.state.title }</Text>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Text style={{ marginTop: 5, marginBottom: 5 }}>
                    Amount: ${ this.state.amount.toFixed(2) }
                  </Text>
                  <Text style={{ marginTop: 5, marginBottom: 5 }}>
                    Date: { this.state.date }
                  </Text>
                  <Text style={{ marginTop: 5, marginBottom: 5 }}>
                    Saved: ${ this.state.saved.toFixed(2) }
                  </Text>
                </Body>
              </CardItem>
              <List>
                {this.state.categories.map((category, index) => (
                  <ListItem avatar key={index}>
                    <Left>
                      <Button
                        rounded
                        info={category.status === 'NEAR'}
                        success={category.status === 'UNDER'}
                        warning={category.status === 'ABOVE'}
                      >
                        <Text>{'   '}</Text>
                      </Button>
                    </Left>
                    <Body>
                      <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>{category.name}</Text>
                      <Text style={{ marginBottom: 4, fontSize: 14 }}>
                        ${category.amount.toFixed(2)} {' > '} ${category.target.toFixed(2)}
                      </Text>
                    </Body>
                    <Right>
                      <Text style={{ marginBottom: 4 }}>${category.current.toFixed(2)}</Text>
                    </Right>
                  </ListItem>
                ))}
              </List>
              <CardItem footer bordered>
                <Left>
                  <Text>Progress: { this.state.percentage * 100 }%</Text>
                </Left>
                <Right>
                  <Progress.Bar progress={this.state.percentage} width={180} height={10} />
                </Right>
              </CardItem>
            </Card>


            <View style={{paddingVertical:30}}/>

            <Button danger onPress={() => this.setState({ rain: !this.state.rain })}>
              <Text>Psst... Lily Press Me</Text>
            </Button>
          </Content>
        </Container>
      </Root>
    )
  }
}

const styles = StyleSheet.create({})
