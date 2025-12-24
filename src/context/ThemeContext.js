import { createContext, useContext } from "react";
import { useColorScheme } from 'nativewind';
import { THEME } from "../utils/theme";
import { StatusBar, View } from "react-native";



const ThemeContext = createContext({})
export const useTheme = () => useContext(ThemeContext);
function ThemeProvider({ children }) {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const themeColor = colorScheme === 'dark' ? THEME.dark : THEME.light;


    return <ThemeContext.Provider value={{ themeColor, toggleColorScheme, theme: colorScheme }}><>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        {children}
    </></ThemeContext.Provider>
}

export default ThemeProvider;