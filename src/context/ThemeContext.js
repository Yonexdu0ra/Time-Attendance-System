import { createContext, useContext } from "react";
import { useColorScheme } from 'nativewind';
import { darkTheme, lightTheme } from "../utils/theme";
import { StatusBar } from "react-native";



const ThemeContext = createContext({})
export const useTheme = () => useContext(ThemeContext);
function ThemeProvider({ children }) {
    const { colorScheme } = useColorScheme();
    // const themeColor = colorScheme === 'dark' ? darkTheme : lightTheme;
    const themeColor = lightTheme;

    return <ThemeContext.Provider value={{ themeColor }}><>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeColor.primary} />
        {children}
    </></ThemeContext.Provider>
}

export default ThemeProvider;