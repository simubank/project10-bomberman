import { StyleSheet, Platform, Dimensions } from 'react-native'
const { height } = Dimensions.get('window')

export default StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#185236',
    elevation: 0,
  },
  left: {
    flex: 1,
    justifyContent: 'center'
  },
  backButton: {
    width: 70
  },
  backIcon: {
    // color: 'grey',
    fontSize: 24,
    marginLeft: 8
  },
  body: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tdLogo: {
    width: 40,
    height: 40
  },
  right: {
    flex: 1
  },
  title: {
    color: '#404040',
    fontWeight: 'bold',
    fontSize: 18
  }
})
