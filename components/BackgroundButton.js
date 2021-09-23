import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'


const BackgroundButton = props => {
  function makeImageIfAny(styles) {
    if (props.showImage) {
      return <Ionicons name={'checkmark-outline'} size={20} color={'white'} />
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
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 14,
        paddingRight: 14
      },
      touchable: {
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 6
      },
      image: {
        marginRight: 8,
        width: 28,
        height: '100%',
      },
      text: {
        fontSize: 16,
        textAlign: 'center',
        color: props.textColor,
      }
    })
  }
}

export default BackgroundButton