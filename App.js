import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  PermissionsAndroid,
} from 'react-native';
import { LocalNotification } from './src/services/LocalPushController';
import Beacons from 'react-native-beacons-android';

export default function App() {
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This example app needs to access your location in order to use bluetooth beacons.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        // permission denied
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const beaconSetup = async () => {
    
    const granted = await requestLocationPermission();
    if (granted) {
      await connect();
      await startScanning();
    } else {
      Alert.alert(
        'Permission error',
        'Location permission not granted. Cannot scan for beacons',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }

    DeviceEventEmitter.addListener('beaconsDidUpdate', ({beacons, region}) => {
      console.log('beaconsDidUpdate', beacons, region);
      LocalNotification();
    });
  }

  useEffect(() => {
    beaconSetup();
  }, []);

  return (
    <View style={styles.container}>
      <Text>hola people!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
