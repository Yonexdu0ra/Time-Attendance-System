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
import useShiftStore from '@/store/shiftStore';

/* ===== SECTION ===== */
function Section({ title, children }) {
  return (
    <View className="gap-3">
      <Text className="text-sm font-semibold text-muted-foreground">
        {title}
      </Text>
      <View className="bg-card border border-border rounded-2xl p-4 gap-4">
        {children}
      </View>
    </View>
  );
}

function LeaveRequestScreen({ navigation }) {
  const formData = useLeaveRequestStore(state => state.formData);
  const setFormData = useLeaveRequestStore(state => state.setFormData);
  const handleCreateLeaveRequest = useLeaveRequestStore(
    state => state.handleCreateLeaveRequest,
  );
  const shifts = useShiftStore(state => state.shifts);

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

  const maxiumEndDate = new Date(safeStartDate);
  maxiumEndDate.setDate(maxiumEndDate.getDate() + 2);

  /* ---------- HANDLERS ---------- */
  const handleChangeLeaveType = value => {
    setFormData({
      leaveType: LEAVE_TYPE[value],
    });
  };
  const handleChangeShiftId = value => {
    setFormData({
      shiftId: value,
    });
  };

  const onChange = (event, selectedDate) => {
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
    <View className="flex-1 bg-background">
      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingVertical: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== DATE PICKER ===== */}
        {show.startDate && (
          <DateTimePicker
            value={safeStartDate}
            minimumDate={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
          />
        )}

        {show.endDate && (
          <DateTimePicker
            value={safeEndDate}
            minimumDate={safeStartDate}
            maximumDate={maxiumEndDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
          />
        )}

        <View className="gap-6">
          {/* ===== TIME ===== */}
          <Section title="Thời gian nghỉ phép">
            <View className="flex-row gap-3">
              <View className="flex-1 gap-2">
                <Text className="text-xs text-muted-foreground">
                  Ngày bắt đầu
                </Text>
                <Button
                  variant="outline"
                  onPress={() => {
                    setShow({ startDate: false, endDate: false });
                    setTimeout(
                      () => setShow({ startDate: true, endDate: false }),
                      0,
                    );
                  }}
                >
                  <Text>{safeStartDate.toLocaleDateString('vi-VN')}</Text>
                </Button>
              </View>

              <View className="flex-1 gap-2">
                <Text className="text-xs text-muted-foreground">
                  Ngày kết thúc
                </Text>
                <Button
                  variant="outline"
                  onPress={() => {
                    setShow({ startDate: false, endDate: false });
                    setTimeout(
                      () => setShow({ startDate: false, endDate: true }),
                      0,
                    );
                  }}
                >
                  <Text>{safeEndDate.toLocaleDateString('vi-VN')}</Text>
                </Button>
              </View>
            </View>

            <View className="flex-row justify-between items-center bg-secondary rounded-xl px-4 py-3">
              <Text className="text-xs text-muted-foreground">
                Số ngày nghỉ tối đa
              </Text>
              <Text className="font-semibold text-primary">3 ngày</Text>
            </View>
          </Section>
          <Section title="Chọn ca muốn xin nghỉ">
            <Picker
              selectedValue={formData.shiftId}
              onValueChange={handleChangeShiftId}
            >
              <Picker.Item
                label="-- Chọn ca muốn xin nghỉ --"
                value=""
                enabled={false}
              />
              {shifts?.map(shiftItem => (
                <Picker.Item
                  key={shiftItem.id}
                  label={shiftItem.name}
                  value={shiftItem.id}
                />
              ))}
            </Picker>
          </Section>
          {/* ===== LEAVE TYPE ===== */}
          <Section title="Loại nghỉ phép">
            <Picker
              selectedValue={formData.leaveType}
              onValueChange={handleChangeLeaveType}
            >
              <Picker.Item
                label="Chọn loại nghỉ phép"
                value=""
                enabled={false}
              />
              {Object.entries(LEAVE_TYPE).map(([key, value]) => (
                <Picker.Item
                  key={key}
                  label={LEAVE_TYPE_STRING[value]}
                  value={key}
                />
              ))}
            </Picker>
          </Section>

          {/* ===== REASON ===== */}
          <Section title="Lý do nghỉ phép">
            <Label>Lý do</Label>
            <Input
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="h-28"
              placeholder="Nhập lý do nghỉ phép..."
              value={formData.reason}
              onChangeText={value => setFormData({ reason: value })}
            />
          </Section>
        </View>
      </ScrollView>

      {/* ===== SUBMIT ===== */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        {shifts?.length < 1  ? (
          <Text>Hiện tại bạn chưa có ca làm việc nào không thể xin nghỉ</Text>
        ) : (
          <Button
            className="h-12 rounded-xl"
            onPress={() => {
              handleCreateLeaveRequest();
              navigation.goBack();
            }}
            disabled={!formData.leaveType || !formData.shiftId}
          >
            <Text className="font-semibold">Gửi yêu cầu</Text>
          </Button>
        )}
      </View>
    </View>
  );
}

export default LeaveRequestScreen;
