/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import FilePickerView from './src/FilePickerView';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <FilePickerView
            pickerType="image"
            style={styles.filePickerView}
            fileFormat={['pdf']}
            onExceedsSizeLimit={() => {
              console.log('Exceeds size limit');
            }}
            onRemovedFile={() => {
              console.log('Removed file');
            }}
            onWrongFileFormat={() => {
              console.log('Wrong file format');
            }}
            onPermissionDenied={permission => {
              console.log('Permission denied', permission);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filePickerView: {
    margin: 16,
  },
});

export default App;
