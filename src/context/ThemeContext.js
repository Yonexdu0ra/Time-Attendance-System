import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from 'nativewind';
import { THEME } from "../utils/theme";
import { StatusBar } from "react-native";
import { storage } from "@/utils/storage";



const ThemeContext = createContext({})
export const useTheme = () => useContext(ThemeContext);
function ThemeProvider({ children }) {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const themeColor = useMemo(() => {
        return colorScheme === 'dark' ? THEME.dark : THEME.light;
    }, [colorScheme]);


    return <ThemeContext.Provider value={{ themeColor, toggleColorScheme, theme: colorScheme }}><>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        {children}
    </></ThemeContext.Provider>
}

export default ThemeProvider;