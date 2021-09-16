import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'


const BackgroundButton = props => {
  function makeImageIfAny(styles) {
    if (props.showImage) {
      return <Image style={styles.image} source={require('../assets/icons/checkmark-white.png')} />
    }
  }
    const styles = makeStyles()
    return (
      <TouchableOpacity style={styles.touchable} onPress={props.onPress}>
        <View style={styles.view}>
          {makeImageIfAny(styles)}
          <Text style={styles.text}>{props.title}</Text>
        </View>
      </TouchableOpacity>
    )


function makeStyles() {
    return StyleSheet.create({
      view: {
        flexDirection: 'row',
        borderRadius: 20,
        borderColor: props.borderColor,
        borderWidth: 2,
        backgroundColor: props.backgroundColor,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 16,
        paddingRight: 16
      },
      touchable: {
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 8
      },
      image: {
        marginRight: 8,
        width: 28,
        height: '100%',
      },
      text: {
        fontSize: 18,
        textAlign: 'center',
        color: props.textColor,
      }
    })
  }
}

export default BackgroundButton