import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Audio, Icon } from 'expo';
import ChordButtons from './components/ChordButtons';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isPlaying: false,
      soundObjectDuration: null,
      soundObjectPosition: null,
    }
  }

  componentWillMount() {
    this._getSoundObject()
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
        <ChordButtons />
      </View>
    );
  }

  async _getSoundObject() {
    this.soundObject = new Audio.Sound();
    try {
      this.soundObject.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
      await this.soundObject.loadAsync(require('./assets/audio/french_four.mp3'))
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
    return '';
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
  };

  _onPlaybackStatusUpdate = status => {
    this.setState({
      soundObjectPosition: status.positionMillis,
      soundObjectDuration: status.durationMillis,
    })
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
