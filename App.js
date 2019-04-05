import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Audio, Icon } from 'expo';
import ChordButtons from './components/ChordButtons';

const tune = 'arkansas_traveler';

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
        <Icon.MaterialCommunityIcons
          name={this.state.isPlaying ? 'pause' : 'play'}
          size={50}
          onPress={this._handlePlayPausePress}
        />
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
})

const chordMapJson = [
  {"chord": 0, "ms": 0},
  {"chord": 3, "ms": 653},
  {"chord": 0, "ms": 1226},
  {"chord": 0, "ms": 1853},

  {"chord": 4, "ms": 2400},
  {"chord": 4, "ms": 2986},
  {"chord": 4, "ms": 3600},
  {"chord": 4, "ms": 4173},

  {"chord": 0, "ms": 4786},
  {"chord": 3, "ms": 5373},
  {"chord": 0, "ms": 5986},
  {"chord": 0, "ms": 6586},

  {"chord": 0, "ms": 7200},
  {"chord": 3, "ms": 7800},
  {"chord": 4, "ms": 8400},
  {"chord": 0, "ms": 8986},

  {"chord": 0, "ms": 9573},
  {"chord": 3, "ms": 10160},
  {"chord": 0, "ms": 10746},
  {"chord": 0, "ms": 11333},

  {"chord": 4, "ms": 11946},
  {"chord": 4, "ms": 12506},
  {"chord": 4, "ms": 13106},
  {"chord": 4, "ms": 13680},

  {"chord": 0, "ms": 14266},
  {"chord": 3, "ms": 14880},
  {"chord": 0, "ms": 15480},
  {"chord": 0, "ms": 16066},

  {"chord": 0, "ms": 16666},
  {"chord": 3, "ms": 17266},
  {"chord": 4, "ms": 17906},
  {"chord": 0, "ms": 18426},

  {"chord": 0, "ms": 19000},
  {"chord": 3, "ms": 19586},
  {"chord": 0, "ms": 20173},
  {"chord": 4, "ms": 20746},

  {"chord": 0, "ms": 21306},
  {"chord": 4, "ms": 21933},
  {"chord": 0, "ms": 22493},
  {"chord": 4, "ms": 23066},

  {"chord": 0, "ms": 23653},
  {"chord": 3, "ms": 24213},
  {"chord": 0, "ms": 24800},
  {"chord": 4, "ms": 25346},

  {"chord": 0, "ms": 25920},
  {"chord": 3, "ms": 26493},
  {"chord": 4, "ms": 27093},
  {"chord": 0, "ms": 27586},

  {"chord": 0, "ms": 28186},
  {"chord": 3, "ms": 28773},
  {"chord": 0, "ms": 29346},
  {"chord": 4, "ms": 29920},

  {"chord": 0, "ms": 30506},
  {"chord": 4, "ms": 31066},
  {"chord": 0, "ms": 31640},
  {"chord": 4, "ms": 32213},

  {"chord": 0, "ms": 32800},
  {"chord": 3, "ms": 33386},
  {"chord": 0, "ms": 33960},
  {"chord": 4, "ms": 34533},

  {"chord": 0, "ms": 35093},
  {"chord": 3, "ms": 35666},
  {"chord": 4, "ms": 36266},
  {"chord": 0, "ms": 36813}]
