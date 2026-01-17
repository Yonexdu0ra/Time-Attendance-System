import { LocationManager } from "@maplibre/maplibre-react-native";
import Geolocation from "@react-native-community/geolocation";
import { useEffect, useState } from "react";

function useLocation(options) {
    const [hasPermissionLocation, setHasPermissionLocation] = useState(false);
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const requestPermission = async () => {
        const result = await LocationManager.requestPermissions();
        setHasPermissionLocation(result);
        return result;
    }
    useEffect(() => {
        requestPermission();

    }, [])
    useEffect(() => {
        let watchId;
        if (hasPermissionLocation) {
            watchId = Geolocation.watchPosition(position => {
                setPosition(position);
                setError(null);
            }, error => {
                setError(error);
            }, { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000, ...options });



        }
        return () => {
            if (watchId !== undefined) {
                Geolocation.clearWatch(watchId);
            }
        };
    }, [hasPermissionLocation])
    return { hasPermissionLocation, position, error, requestPermission };
}

export default useLocation;