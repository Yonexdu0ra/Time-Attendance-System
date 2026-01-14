import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Camera, MapView, UserLocation } from '@maplibre/maplibre-react-native';
import Geolocation from '@react-native-community/geolocation';

const MAP_URL = 'https://api.maptiler.com/maps/base-v4/style.json?key=tZPHtBJcn74rutLOqByE';

function MapScreen() {
  const mapViewRef = useRef(null);

  // State điều khiển Camera
  const [cameraConfig, setCameraConfig] = useState({
    triggerKey: Date.now(), // Key ngẫu nhiên để ép Camera cập nhật khi cần
    centerCoordinate: [105.85, 21.02],
    zoomLevel: 10,
    animationMode: 'none',
    animationDuration: 0,
  });

  // Hàm xử lý Zoom (Dùng async/await để lấy zoom hiện tại chính xác)
  const handleZoom = async (increment) => {
    try {
      // 1. Lấy độ zoom thực tế hiện tại từ MapView (quan trọng!)
      const currentZoom = await mapViewRef.current.getZoom();

      
      console.log(currentZoom);
      
      // 2. Cập nhật state để Camera bay đến độ zoom mới
      setCameraConfig(prev => ({
        ...prev,
        triggerKey: Date.now(), // Luôn đổi key để ép render
        zoomLevel: currentZoom + increment, // Zoom từ vị trí thực tế
        animationMode: 'easeTo',
        animationDuration: 500,
        // Giữ nguyên centerCoordinate cũ nếu không muốn map bị nhảy về vị trí mặc định
        centerCoordinate: prev.centerCoordinate 
      }));
    } catch (e) {
      console.log('Error zooming:', e);
    }
  };

  const handleMoveToUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCameraConfig({
          triggerKey: Date.now(),
          centerCoordinate: [longitude, latitude],
          zoomLevel: 15,
          animationMode: 'flyTo',
          animationDuration: 2000,
        });
      },
      (error) => Alert.alert("Lỗi", "Không thể lấy vị trí."),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  // Cập nhật tọa độ vào state khi người dùng kéo map thủ công
  // Để tránh việc bấm "Vị trí của tôi" xong nó lại nhảy về chỗ cũ trước đó
  const onRegionDidChange = async (feature) => {
    if (feature && feature.geometry && feature.geometry.coordinates) {
       // Cập nhật ngầm (silent update) không animation
       // Việc này đảm bảo biến state centerCoordinate luôn đúng với thực tế
       const [lng, lat] = feature.geometry.coordinates;
       setCameraConfig(prev => ({
         ...prev,
         centerCoordinate: [lng, lat],
         animationMode: 'none'
       }));
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        // SỬA LỖI: Dùng styleURL cho link online
        mapStyle={MAP_URL} 
        logoEnabled={false}
        // Hàm này giúp đồng bộ state khi người dùng tự kéo map
        onRegionDidChange={onRegionDidChange}
      >
        <UserLocation visible={true} animated={true} />

        <Camera 
          // Dùng triggerKey để ép Camera nhận diện thay đổi kể cả khi tham số giống nhau
          key={cameraConfig.triggerKey} 
          zoomLevel={cameraConfig.zoomLevel}
          centerCoordinate={cameraConfig.centerCoordinate}
          animationMode={cameraConfig.animationMode}
          animationDuration={cameraConfig.animationDuration}
        />
      </MapView>

      {/* Nút Zoom In */}
      <TouchableOpacity 
        style={[styles.controlBtn, { bottom: 160 }]}
        onPress={() => handleZoom(1)}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {/* Nút Zoom Out */}
      <TouchableOpacity 
        style={[styles.controlBtn, { bottom: 100 }]}
        onPress={() => handleZoom(-1)}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      {/* Nút Vị trí tôi */}
      <TouchableOpacity 
        style={[styles.locationButton, { bottom: 40 }]}
        onPress={handleMoveToUserLocation}
      >
        <Text style={styles.buttonText}>Vị trí của tôi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controlBtn: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'white',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  locationButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  buttonText: { fontWeight: 'bold', color: 'black', fontSize: 16 }
});

export default MapScreen;