import { createContext, useContext } from "react";
import { useColorScheme } from 'nativewind';
import { darkTheme, lightTheme } from "../utils/theme";



const ThemeContext = createContext({})
export const useTheme = () => useContext(ThemeContext);
function ThemeProvider({ children }) {
    const { colorScheme } = useColorScheme();
    const themeColor = colorScheme === 'dark' ? darkTheme : lightTheme;

    return <ThemeContext.Provider value={{ themeColor }}>{children}</ThemeContext.Provider>
}

export default ThemeProvider;