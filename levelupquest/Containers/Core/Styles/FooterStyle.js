import { StyleSheet, Platform, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
  footer: {
    // backgroundColor: '#F4F4F4',
    // height: Platform.OS === 'ios' && height === 812 ? 84 : 50
    position: 'relative',
    top: 5,
  },
  fullBtn: {
    height: 50,
    flex: 1,
    width: '100%',
    backgroundColor: 'green'
  },
  fullBtnTxt: {
    fontSize: 18,
    letterSpacing: 1
  }
})
