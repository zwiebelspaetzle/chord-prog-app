import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const chords = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viiᴼ']

class ChordButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentButton: this.props.currentChord || 0,
      selectedButton: null,
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.currentChord !== prevProps.currentChord) {
      this.setState({
        currentButton: this.props.currentChord,
        selectedButton: null
      })
    }
  }

  render() {
    return (
      <View>
        {chords.map((text, index) => this._getChordButton(text, index))}
      </View>
    )
  }

  _getChordButton = (text, index) => {
    let buttonStyle = [styles.chordButton]

    if (this.props.showCurrentChord && this.state.currentButton === index) {
      buttonStyle.push(styles.chordButtonCurrent)
    }
    if (this.state.selectedButton === index) {
      if (this.state.selectedButton == this.state.currentButton) {
        buttonStyle.push(styles.chordButtonSelected)
      } else {
        buttonStyle.push(styles.chordButtonIncorrect)
      }
    }

    return (
      <TouchableOpacity
        key={index}
        onPress={() => this._handleChordButtonPress(index)}
        style={buttonStyle}
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
  chordButtonCurrent: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  chordButtonSelected: {
    backgroundColor: '#6480FF',
  },
  chordButtonIncorrect: {
    backgroundColor: '#FF3D32',
  },
  chordButtonText: {
    color: '#6480FF',
    fontSize: 20,
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
