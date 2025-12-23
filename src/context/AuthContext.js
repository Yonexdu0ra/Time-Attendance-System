import { createContext, useContext, useEffect, useState } from "react";



const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
function AuthProvider({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState();
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
            setUser({
                id: 1
            });
        }, 500);
        return () => clearTimeout(timeout);
    }, []);
    return <AuthContext.Provider value={{
        isLoading,
        user,
        accessToken,
        setAccessToken
    }}>{children}</AuthContext.Provider>
}

export default AuthProvider;