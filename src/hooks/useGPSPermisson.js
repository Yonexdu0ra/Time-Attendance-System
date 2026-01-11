import Geolocation from '@react-native-community/geolocation';
import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

const ANDROID_PERMISSIONS = [
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
];

export default function useGPSPermission() {
  const [hasPermission, setHasPermission] = useState(false);
  const checkPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setHasPermission(true);
      return true;
    }

    const fine = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    const coarse = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );


    const allowed = fine && coarse;
    setHasPermission(allowed);
    return allowed;
  }, []);

  const requestPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setHasPermission(true);
      return true;
    }
    
    const result = await PermissionsAndroid.requestMultiple(
      ANDROID_PERMISSIONS,
    );

    const allowed = Object.values(result).every(
      r => {
        console.log(r);

        return r === PermissionsAndroid.RESULTS.GRANTED
      },
    );

    setHasPermission(allowed);
    return allowed;
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    hasPermission,
    requestPermission,
  };
}
