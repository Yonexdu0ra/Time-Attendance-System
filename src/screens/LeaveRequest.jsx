import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Plus } from 'lucide-react-native';
import { useLayoutEffect, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

const fakeData = [
  {
    id: '1f3c9f7a-1b4a-4d7e-b5e2-001111111111',
    userId: 'u1-uuid-1234',
    startDate: new Date('2025-12-25'),
    endDate: new Date('2025-12-26'),
    reason: 'Đi du lịch',
    reply: null,
    status: 0, // pending
    leaveType: 1, // có lương
    createdAt: new Date(),
    updatedAt: new Date(),
    approverId: null,
    approvedAt: null,
  },
  {
    id: '2a7b8c9d-2c5b-4e7f-a6d3-002222222222',
    userId: 'u2-uuid-5678',
    startDate: new Date('2025-12-20'),
    endDate: new Date('2025-12-22'),
    reason:
      'Bệnh cảm bdsmaf sdfjkh fjksdhfkasd shdkfjh sdkjfhsadkjfh kjsahfkjsdhfkjsdh fsd fkjsdhfkjsahfksald ksdhf ksadj hfskdh skhf ksdhfksadh fksdh fksdh ksa hfks sahfsdk hskd ksda hksd hksdh fklsjadhfksdhfksd hkj',
    reply:
      'Chấp nhận jhfdsgh dghdk dkfhgk hdk dkgjhdfgkjdfhkj hdkfkdhgkdfhkdsfh kjdfhkgjdfhk dk kdfjhg kdsfhgkd hkjdsfhgkjdfhg kdfj ',
    status: 1, // approved
    leaveType: 2, // ốm đau
    createdAt: new Date(),
    updatedAt: new Date(),
    approverId: 'approver-uuid-1',
    approvedAt: new Date('2025-12-19'),
  },
  {
    id: '3d4e5f6a-3e6c-4f7d-b7e4-003333333333',
    userId: 'u3-uuid-9012',
    startDate: new Date('2025-12-28'),
    endDate: new Date('2025-12-30'),
    reason: 'Công việc riêng',
    reply: 'Từ chối',
    status: 2, // rejected
    leaveType: 3, // riêng tư
    createdAt: new Date(),
    updatedAt: new Date(),
    approverId: 'approver-uuid-2',
    approvedAt: new Date('2025-12-27'),
  },
  {
    id: '4f5g6h7b-4f7d-4g8h-c8f5-004444444444',
    userId: 'u1-uuid-1234',
    startDate: new Date('2025-12-15'),
    endDate: new Date('2025-12-15'),
    reason: 'Việc gia đình',
    reply: null,
    status: 3, // cancelled
    leaveType: 1, // có lương
    createdAt: new Date(),
    updatedAt: new Date(),
    approverId: 'approver-uuid-1',
    approvedAt: null,
  },
  {
    id: '5g6h7i8c-5g8h-4h9i-d9g6-005555555555',
    userId: 'u2-uuid-5678',
    startDate: new Date('2025-12-10'),
    endDate: new Date('2025-12-12'),
    reason: 'Bệnh nhẹ',
    reply: 'Chấp nhận',
    status: 1, // approved
    leaveType: 2, // ốm đau
    createdAt: new Date(),
    updatedAt: new Date(),
    approverId: 'approver-uuid-2',
    approvedAt: new Date('2025-12-09'),
  },
];

function LeaveRequestScreen({ navigation }) {
  const [isShowButtonCreate, setIsShowButtonCreate] = useState(true);
  return (
    <View className="relative flex-1">
      <ScrollView>
        {fakeData.map(item => (
          <View key={item.id} className="p-4 m-2 rounded-lg bg-background flex flex-col gap-2">
            <View className="flex flex-row justify-between items-center gap-2">
              <View className="flex flex-col flex-1 gap-2">
                <Text>{item.leaveType}</Text>
                <Text variant="small" className={'text-muted-foreground'}>
                  {new Date(item.startDate).toLocaleDateString()} -{' '}
                  {new Date(item.endDate).toLocaleDateString()}
                </Text>
              </View>
              <Text>{item.status}</Text>
            </View>
            <View className="bg-muted p-1 rounded">
              <Text variant="muted" numberOfLines={2} ellipsizeMode="tail">
                <Text>Lý do:</Text>
                {item.reason}
              </Text>
            </View>
            {item.reply && (
              <View className="bg-muted p-1 rounded">
                <Text variant="muted" numberOfLines={2} ellipsizeMode="tail">
                  <Text>Phản hồi:</Text>
                  {item.reply}
                </Text>
              </View>
            )}
            <View className="flex flex-row w-full items-center justify-between">
              <Text>
                Ngày tạo: {new Date(item.createdAt).toLocaleDateString()}
              </Text>

              {item.status === 0 && (
                <Button variant={'ghost'}>
                  <Text className={'text-destructive'}>Hủy yêu cầu</Text>
                </Button>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {isShowButtonCreate && (
        <Button
          variant={'outline'}
          className={'absolute bottom-5 right-5 z-50'}
        >
          <Plus />
        </Button>
      )}
    </View>
  );
}

export default LeaveRequestScreen;
