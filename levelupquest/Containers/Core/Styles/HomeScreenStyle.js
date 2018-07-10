import { StyleSheet, Platform, Dimensions } from 'react-native'
import { Colors, Metrics, ApplicationStyles } from '../../../Themes/'
const { height } = Dimensions.get('window')

const horizontalMargin = 20
const slideWidth = 280
const sliderWidth = Dimensions.get('window').width
const itemWidth = slideWidth + horizontalMargin * 2
const itemHeight = 200

export default StyleSheet.create({
  container: {
    backgroundColor: '#FFF'
  },
  text: {
    alignSelf: 'center',
    marginBottom: 7
  },
  mb: {
    marginBottom: 15,
    backgroundColor: '#185236',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -300,
    paddingTop: 300
  },
  slide: {
    width: itemWidth,
    height: itemHeight,
    paddingHorizontal: horizontalMargin
    // other styles for the item container
  },
  slideInnerContainer: {
    width: slideWidth,
    flex: 1
    // other styles for the inner container
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50
  },
  listItem: {
    height: 70
  }
})
