import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const chords = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viiᴼ']

class ChordButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {selectedButton: null}
  }

  render() {
    return (
      <View>
        {chords.map((text, index) => this._getChordButton(text, index))}
      </View>
    )
  }

  _getChordButton = (text, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this._handleChordButtonPress(index)}
        style={[styles.chordButton, (this.state.selectedButton == index) ? styles.chordButtonSelected: null]}
      >
        <Text
          style={[styles.chordButtonText, (this.state.selectedButton == index) ? styles.chordButtonTextSelected: null]}
        >{text}</Text>
      </TouchableOpacity>
    )
  }

  _handleChordButtonPress = (index) => {
    this.setState({selectedButton: index})
  }
}

const styles = StyleSheet.create({
  chordButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#6480FF',
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: 'center',
    margin: 3,
    padding: 10,
    width: 100,
  },
  chordButtonSelected: {
    backgroundColor: '#6480FF',
  },
  chordButtonText: {
    color: '#6480FF',
    fontSize: 20
  },
  chordButtonTextSelected: {
    color: '#fff',
  },
});

export default ChordButtons

/*
blue:   6480FF
green:  31E8A9
yellow: C6FF43
orange: E8A831
red:    FF3D32
*/
