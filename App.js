import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Audio, Icon } from 'expo'
import ChordButtons from './components/ChordButtons'

const tune = 'arkansas_traveler'
import chordMapJson from './assets/audio/arkansas_traveler_map.json'


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.chordMap = null
    this.state = {
      currentChord: 0,
      isPlaying: false,
      soundObjectDuration: null,
      soundObjectPosition: null,
    }
  }

  componentWillMount() {
    this._getSoundObject()
    this._loadChordMap()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.controlsContainer}>
          <Icon.MaterialCommunityIcons
            name='skip-backward'
            size={30}
            onPress={this._handleBackPress}
            />
          <Icon.MaterialCommunityIcons
            name={this.state.isPlaying ? 'pause' : 'play'}
            size={50}
            onPress={this._handlePlayPausePress}
          />
        </View>
        <Text>Position: {this._getTimestamp()} ms</Text>
        <ChordButtons currentChord={this.state.currentChord} />
        <Text>Current Chord: {this.state.currentChord}</Text>
      </View>
    );
  }

  async _getSoundObject() {
    this.soundObject = new Audio.Sound();
    try {
      this.soundObject.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
      await this.soundObject.loadAsync(require(`./assets/audio/${tune}.mp3`))
      this.soundObject.setProgressUpdateIntervalAsync(50)
    } catch (error) {
      console.log(error)
    }
  }

  _getTimestamp() {
    if (
      this.soundObject != null &&
      this.state.soundObjectPosition != null &&
      this.state.soundObjectDuration != null
    ) {
      return `${this.state.soundObjectPosition} / ${this.state.soundObjectDuration}`
    }
    return ''
  }

  _handleBackPress = () => {
    if (this.soundObject != null) {
      this.soundObject.setPositionAsync(0)
    }
  }

  _handlePlayPausePress = () => {
    if (this.soundObject != null) {
      if (this.state.isPlaying) {
        this.setState({isPlaying: false})
        this.soundObject.pauseAsync()
      } else {
        this.setState({isPlaying: true})
        this.soundObject.playAsync()
      }
    }
  }

  _onPlaybackStatusUpdate = status => {
    if (this.chordMap && this.chordMap.length != 0) {
      if (status.positionMillis > this.chordMap[0]['ms']) {
        this._nextChord()
      }
    }
    this.setState({
      soundObjectPosition: status.positionMillis,
      soundObjectDuration: status.durationMillis,
    })
  }

  _loadChordMap() {
    this.chordMap = chordMapJson
    this._nextChord()
  }

  _nextChord() {
    this.setState({currentChord: this.chordMap.shift()['chord']})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
