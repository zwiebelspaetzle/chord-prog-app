import React from 'react'
import { Button, StyleSheet, Switch, Text, View } from 'react-native'
import { Audio, Icon } from 'expo'
import ChordButtons from './components/ChordButtons'

const chords = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viiᴼ'] // TODO: de-dupe this
const semitones = ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b']
const skipRestartThreshold = 500 // ms
const statusUpdateInterval = 50  // ms

const samples = {
  'c':  require('./assets/samples/db-c.wav'),
  'cs': require('./assets/samples/db-cs.wav'),
  'd':  require('./assets/samples/db-d.wav'),
  'ds': require('./assets/samples/db-ds.wav'),
  'e':  require('./assets/samples/db-e.wav'),
  'f':  require('./assets/samples/db-f.wav'),
  'fs': require('./assets/samples/db-fs.wav'),
  'g':  require('./assets/samples/db-g.wav'),
  'gs': require('./assets/samples/db-gs.wav'),
  'a':  require('./assets/samples/db-a.wav'),
  'as': require('./assets/samples/db-as.wav'),
  'b':  require('./assets/samples/db-b.wav')
}

const tunes = [
  {
    "title": "Arkansas Traveler",
    "key": "d",
    "difficulty": 2,
    "audio": require('./assets/tunes/arkansas_traveler.mp3'),
    "map": require('./assets/tune_maps/arkansas_traveler.json'),
  },
  {
    "title": "Whiskey Before Breakfast",
    "key": "d",
    "difficulty": 2,
    "audio": require('./assets/tunes/whiskey.mp3'),
    "map": require('./assets/tune_maps/whiskey.json'),
  }
]

export default class App extends React.Component {
  sampler = {}
  soundObject = null

  constructor(props) {
    super(props)
    this.chordMap = null
    this.state = {
      currentChord: 1,
      currentTune: tunes[0],
      currentTuneIndex: 0,
      isPlaying: false,
      playBass: true,
      showCurrentChord: true,
      soundObjectDuration: null,
      soundObjectPosition: null,
    }
  }

  componentWillMount() {
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
            onValueChange={() => this._handleToggle('showCurrentChord')}
            value={this.state.showCurrentChord}
          >
          </Switch>
        </View>
        <View style={styles.controlsContainer}>
          <Text>Play bass </Text>
          <Switch
            onValueChange={() => this._handleToggle('playBass')}
            value={this.state.playBass}
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

  _getScale = (key) => {
    let semitoneSequence = [0, 2, 4, 5, 7, 9, 11]
    let root = semitones.indexOf(key)

    let scale = semitoneSequence.map((offset) => {
      let index = (root + offset < semitones.length) ? root + offset : root + offset - semitones.length
      return semitones[index]
    })

    return scale
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
        let index = (this.state.currentTuneIndex <= 0) ? tunes.length - 1 : this.state.currentTuneIndex - 1
        this._skipToTrack(index)
      } else {
        this.soundObject.setPositionAsync(0)
        this._loadChordMap(this.state.currentTune.map)
      }
    }
  }

  _handleNextPress = () => {
    let index = (this.state.currentTuneIndex + 1 >= tunes.length) ? 0 :this.state.currentTuneIndex + 1
    this._skipToTrack(index)
  }

  _handleToggle = (key) => {
    this.setState({[key]: !this.state[key]})
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
      this.sampler['I'].replayAsync()
    } else {
      console.log('sampler is null')
    }
  }

  _loadChordMap(map) {
    this.chordMap = Array.from(map)
    this.setState({currentChord: this.chordMap[0]['chord']})
  }

  async _loadSamplers(key) {
    let scale = this._getScale(key)

    chords.forEach(async (chord, index) => {
      this.sampler[chord] = new Audio.Sound()
      try {
        await this.sampler[chord].loadAsync(samples[scale[index]])
      } catch (error) {
        console.log(error)
      }
    })
  }

  async _loadSoundObject(audio) {
    this.soundObject = new Audio.Sound()
    try {
      this.soundObject.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
      await this.soundObject.loadAsync(audio)
      this.soundObject.setProgressUpdateIntervalAsync(statusUpdateInterval)
    } catch (error) {
      console.log(error)
    }
  }

  _loadTune = () => {
    this._loadSoundObject(this.state.currentTune.audio)
    this._loadChordMap(this.state.currentTune.map)
    this._loadSamplers(this.state.currentTune.key)
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
        currentTune: tunes[index],
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

// samples by Carlos Vaquero https://freesound.org/people/Carlos_Vaquero/