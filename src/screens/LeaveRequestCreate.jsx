import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLayoutEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';

import { Picker } from '@react-native-picker/picker';
function LeaveRequestScreen({ navigation }) {
  const [show, setShow] = useState({
    startDate: false,
    endDate: false,
  });
  const [scheduler, setScheduler] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios'); // iOS giữ picker mở, Android tự đóng
    if (selectedDate)
      setScheduler(prev => ({ ...prev, startDate: selectedDate }));
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Yêu cầu nghỉ phép',
      headerShown: true,
    });
  }, [navigation]);
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="bg-secondary">
        {show.startDate && (
          <DateTimePicker
            minimumDate={new Date()}
            value={scheduler.startDate}
            mode="date" // "date" | "time" | "datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
          />
        )}
        {show.endDate && (
          <DateTimePicker
            minimumDate={new Date()}
            value={scheduler.endDate}
            mode="date" // "date" | "time" | "datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
          />
        )}
        <View className="p-4 flex flex-col gap-4">
          <View className="flex flex-row gap-4 w-full ">
            <View className="flex flex-col gap-2 flex-1 ">
              <Text variant="small">Thời gian bắt đầu</Text>
              <Button
                variant={'outline'}
                onPress={() => setShow(prev => ({ ...prev, startDate: true }))}
              >
                <Text>
                  {' '}
                  {scheduler.startDate
                    ? scheduler.startDate.toLocaleDateString()
                    : 'Chọn ngày'}
                </Text>
              </Button>
            </View>
            <View className="flex flex-col gap-2 flex-1">
              <Text variant="small">Thời gian kết thúc</Text>
              <Button
                variant={'outline'}
                onPress={() => setShow(prev => ({ ...prev, endDate: true }))}
              >
                <Text>
                  {scheduler.endDate
                    ? scheduler.endDate.toLocaleDateString()
                    : 'Chọn ngày'}
                </Text>
              </Button>
            </View>
          </View>
          <View className="p-4 flex flex-col gap-2 rounded-lg m-2 bg-blue-200">
            <Text variant="muted">Tổng số ngày nghỉ tối đa</Text>
            <Text variant="small" className={'text-blue-500'}>
              3 ngày
            </Text>
          </View>
          <Text>Chi tiết</Text>
          <View className=" rounded-lg">
            <Text>Chọn loại nghỉ phép</Text>
            <Picker>
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" />
            </Picker>
          </View>
          <View>
            <Label>Lý do nghỉ phép</Label>
            <Input
              multiline
              numberOfLines={4}
              className="h-24 mt-2 text-start align-top"
              placeholder="Nhập lý do nghỉ phép..."
            />
          </View>
          <Button><Text>Gửi yêu cầu</Text></Button>
        </View>
      </ScrollView>
    </View>
  );
}

export default LeaveRequestScreen;
