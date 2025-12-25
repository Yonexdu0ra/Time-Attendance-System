import { View } from "react-native";

function Corner({ position }) {
    const base = 'absolute w-6 h-6 border-emerald-400';

    const map = {
        'top-left': 'top-0 left-0 border-l-4 border-t-4 rounded-tl-2xl',
        'top-right': 'top-0 right-0 border-r-4 border-t-4 rounded-tr-2xl',
        'bottom-left': 'bottom-0 left-0 border-l-4 border-b-4 rounded-bl-2xl',
        'bottom-right': 'bottom-0 right-0 border-r-4 border-b-4 rounded-br-2xl',
    };

    return <View className={`${base} ${map[position]}`} />;
}
export default Corner;