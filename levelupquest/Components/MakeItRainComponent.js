import React, { Component } from 'react'
import { Image, Alert, StyleSheet, View, Dimensions } from 'react-native'

import moneyFront from '../Images/money20-front.png';
import moneyBack from '../Images/money20-back.png';
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

class MakeItRainComponent extends Component {
  // constructor(props) {
  //   super(props)
  // }

  render() {
    return (
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
    )
  }
}

export default MakeItRainComponent
