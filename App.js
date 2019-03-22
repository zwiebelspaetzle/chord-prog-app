import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Audio, Icon } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isPlaying: false}
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
          onPress={this._onPlayPausePressed}
        />
      </View>
    );
  }

  async _getSoundObject() {
    this.soundObject = new Audio.Sound();
    try {
      await this.soundObject.loadAsync(require('./assets/audio/french_four.mp3'));
    } catch (error) {
      console.log(error)
    }
  }

  _onPlayPausePressed = () => {
    if (this.soundObject != null) {
      if (this.state.isPlaying) {
        this.setState({isPlaying: false})
        this.soundObject.pauseAsync();
      } else {
        this.setState({isPlaying: true})
        this.soundObject.playAsync();
      }
    }
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
