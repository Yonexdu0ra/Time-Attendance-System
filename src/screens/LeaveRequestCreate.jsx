import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLayoutEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import useLeaveRequestStore from '@/store/leaveRequestStore';
import useAuthStore from '@/store/authStore';

function LeaveRequestScreen({ navigation }) {
  const formData = useLeaveRequestStore(state => state.formData);
  const setFormData = useLeaveRequestStore(state => state.setFormData);
  const handleCreateLeaveRequest = useLeaveRequestStore(
    state => state.handleCreateLeaveRequest,
  );

  const { LEAVE_TYPE_STRING, LEAVE_TYPE } = useAuthStore(state => state.config);

  const [show, setShow] = useState({
    startDate: false,
    endDate: false,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Yêu cầu nghỉ phép',
      headerShown: true,
    });
  }, [navigation]);

  /* ---------- SAFE DATE ---------- */
  const safeStartDate =
    formData.startDate instanceof Date ? formData.startDate : new Date();

  const safeEndDate =
    formData.endDate instanceof Date ? formData.endDate : safeStartDate;

  /* ---------- HANDLERS ---------- */
  const handleChangeLeaveType = value => {
    setFormData({
      leaveType: LEAVE_TYPE[value],
    });
  };

  const onChange = (event, selectedDate) => {
    // Android có dismissed / set
    if (event.type !== 'set') {
      setShow({ startDate: false, endDate: false });
      return;
    }

    const date =
      Platform.OS === 'android'
        ? new Date(event.nativeEvent.timestamp)
        : selectedDate;

    if (!date || isNaN(date)) {
      setShow({ startDate: false, endDate: false });
      return;
    }

    setFormData({
      startDate: show.startDate ? date : safeStartDate,
      endDate: show.endDate ? date : safeEndDate,
    });

    setShow({ startDate: false, endDate: false });
  };

  return (
    <View className="flex-1 p-4 bg-background">
      <ScrollView className="">
        {/* START DATE PICKER */}
        {show.startDate && (
          <DateTimePicker
            value={safeStartDate}
            minimumDate={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
          />
        )}

        {/* END DATE PICKER */}
        {show.endDate && (
          <DateTimePicker
            value={safeEndDate}
            minimumDate={safeStartDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
          />
        )}

        <View className="p-4 flex flex-col gap-4">
          {/* DATE BUTTONS */}
          <View className="flex flex-row gap-4 w-full">
            <View className="flex-1 gap-2">
              <Text variant="small">Thời gian bắt đầu</Text>
              <Button
                variant="outline"
                onPress={() => {
                  setShow({ startDate: false, endDate: false });
                  setTimeout(() => {
                    setShow({ startDate: true, endDate: false });
                  }, 0);
                }}
              >
                <Text>{safeStartDate.toLocaleDateString('vi-VN')}</Text>
              </Button>
            </View>

            <View className="flex-1 gap-2">
              <Text variant="small">Thời gian kết thúc</Text>
              <Button
                variant="outline"
                onPress={() => {
                  setShow({ startDate: false, endDate: false });
                  setTimeout(() => {
                    setShow({ startDate: false, endDate: true });
                  }, 0);
                }}
              >
                <Text>{safeEndDate.toLocaleDateString('vi-VN')}</Text>
              </Button>
            </View>
          </View>

          {/* INFO */}
          <View className="p-4 rounded-lg bg-secondary flex flex-row justify-between items-center">
            <Text variant="muted">Tổng số ngày nghỉ tối đa</Text>
            <Text className="text-blue-500">3 ngày</Text>
          </View>

          {/* LEAVE TYPE */}
          <View>
            <Text>Chọn loại nghỉ phép</Text>
            <Picker
              selectedValue={formData.leaveType}
              onValueChange={handleChangeLeaveType}
            >
              <Picker.Item label="Chọn loại nghỉ phép" value="" enabled={false} />
              {Object.entries(LEAVE_TYPE).map(([key, value]) => (
                <Picker.Item
                  key={key}
                  label={LEAVE_TYPE_STRING[value]}
                  value={key}
                />
              ))}
            </Picker>
          </View>

          {/* REASON */}
          <View>
            <Label>Lý do nghỉ phép</Label>
            <Input
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="h-24 mt-2"
              placeholder="Nhập lý do nghỉ phép..."
              value={formData.reason}
              onChangeText={value => setFormData({ reason: value })}
            />
          </View>

          {/* SUBMIT */}
        </View>
      </ScrollView>
      <Button
        onPress={() => {
          handleCreateLeaveRequest(navigation);
          navigation.goBack();
        }}
      >
        <Text>Gửi yêu cầu</Text>
      </Button>
    </View>
  );
}

export default LeaveRequestScreen;
