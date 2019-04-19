import React from 'react'
import { Button, StyleSheet, Switch, Text, View } from 'react-native'
import { Audio, Icon } from 'expo'
import ChordButtons from './components/ChordButtons'

const skipRestartThreshold = 500 // ms
const statusUpdateInterval = 50  // ms

const toc = [
  {
    "title": "Arkansas Traveler",
    "difficulty": 2,
    "audio": require('./assets/audio/arkansas_traveler.mp3'),
    "map": require('./assets/audio/arkansas_traveler_map.json'),
  },
  {
    "title": "Whiskey Before Breakfast",
    "difficulty": 2,
    "audio": require('./assets/audio/whiskey.mp3'),
    "map": require('./assets/audio/whiskey_map.json'),
  }
]


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.chordMap = null
    this.state = {
      currentChord: 1,
      currentTune: toc[0],
      currentTuneIndex: 0,
      isPlaying: false,
      showCurrentChord: true,
      soundObjectDuration: null,
      soundObjectPosition: null,
    }
  }

  componentWillMount() {
    this._loadSampler()
    this._loadTune()
  }

  render() {
    let status = (this._getTimestamp()) ? `Position: ${this._getTimestamp()} ms` : 'loading...'
    return (
      <View style={styles.container}>
        <Text style={styles.h2}>{this.state.currentTune.title}</Text>
        <Text>{status}</Text>

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
          <Icon.MaterialCommunityIcons
            name='skip-forward'
            size={30}
            onPress={this._handleNextPress}
          />
        </View>

        <ChordButtons currentChord={this.state.currentChord} showCurrentChord={this.state.showCurrentChord}/>

        <View style={styles.controlsContainer}>
          <Text>Show current chord </Text>
          <Switch
            onValueChange={this._handleShowCurrentChordSwitch}
            value={this.state.showCurrentChord}
          >
          </Switch>
        </View>
        <Button
          title="Click"
          onPress={this._handleSamplerButtonPress}
        >
        </Button>
      </View>
    );
  }

  async _getSoundObject(audio) {
    this.soundObject = new Audio.Sound();
    try {
      this.soundObject.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
      await this.soundObject.loadAsync(audio)
      this.soundObject.setProgressUpdateIntervalAsync(statusUpdateInterval)
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
      if (this.state.soundObjectPosition < skipRestartThreshold) {
        let index = (this.state.currentTuneIndex <= 0) ? toc.length - 1 : this.state.currentTuneIndex - 1
        this._skipToTrack(index)
      } else {
        this.soundObject.setPositionAsync(0)
        this._loadChordMap(this.state.currentTune.map)
      }
    }
  }

  _handleNextPress = () => {
    let index = (this.state.currentTuneIndex + 1 >= toc.length) ? 0 :this.state.currentTuneIndex + 1
    this._skipToTrack(index)
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

  _handleSamplerButtonPress = () => {
    if (this.sampler != null) {
      this.sampler.replayAsync()
    } else {
      console.log('sampler is null')
    }
  }

  _handleShowCurrentChordSwitch = () => {
    this.setState({showCurrentChord: !this.state.showCurrentChord})
  }

  _loadChordMap(map) {
    this.chordMap = Array.from(map)
    this.setState({currentChord: this.chordMap[0]['chord']})
  }

  async _loadSampler() {
    this.sampler = new Audio.Sound();
    try {
      await this.sampler.loadAsync(require('./assets/audio/Alesis-Fusion-Acoustic-Bass-C2.wav'))
      this.soundObject.setProgressUpdateIntervalAsync(statusUpdateInterval)
    } catch (error) {
      console.log(error)
    }
  }

  _loadTune = () => {
    this._getSoundObject(this.state.currentTune.audio)
    this._loadChordMap(this.state.currentTune.map)
  }

  _nextChord() {
    this.setState({currentChord: this.chordMap.shift()['chord']})
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

  _skipToTrack = (index) => {
    this.soundObject.pauseAsync()
    this.setState(
      {
        currentTuneIndex: index,
        currentTune: toc[index],
        isPlaying: false
      },
      this._loadTune
    )
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
  h2: {
    // fontFamily: 'Times New Roman',
    fontSize: 30,
    fontWeight: 'bold',
  }
})
