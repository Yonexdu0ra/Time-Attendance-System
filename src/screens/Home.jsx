import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
const Item = ({ title }) => (
  <View>
    <Text className="text-red-500 p-4">{title}</Text>
  </View>
);
function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    // setLoading(true);
    // setRefreshing(true);
    fetch('https://jsonplaceholder.typicode.com/todos/')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error))
      .finally(() => {
        setLoading(false);
      })
      .then(() => setRefreshing(false));
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Tuyến Công CB',
      headerRight: () => (
        <Text
          className="text-lg font-bold ml-4"
          onPress={() => navigation.navigate('Notification')}
        >
          Noti
        </Text>
      ),
    });
  }, [navigation]);
  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          data.map(item => <Item key={item.id} title={item.title} />)
        )}
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
