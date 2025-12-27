
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react-native';
import { useLayoutEffect } from 'react';
import { View, Text } from 'react-native';

function OvertimeRequestScreen({ navigation }) {
  
  return (
   <View className='relative flex-1'>
      

      <Button variant={'outline'} className={'absolute bottom-5 right-5 z-50'} onPress={() => navigation.push('RequestOvertimeCreate')}>
        <Plus />
      </Button>
    </View>
  );
}

export default OvertimeRequestScreen;
