import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type User = { _id: string; email: string, username: string } | null;

export interface UserContextType
{
    user: User;
    setUser: (user: User) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_KEY = "user";

const getUserFromLocalStorage = (): User =>
{
    try
    {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch
    {
        return null;
    }
};

const setUserInLocalStorage = (user: User) =>
{
    if (user)
    {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else
    {
        localStorage.removeItem(USER_KEY);
    }
};

export const UserProvider = ({ children }: { children: ReactNode }) =>
{
    const [user, setUserState] = useState<User>(null);

    // Carregar user do localStorage ao montar
    useEffect(() =>
    {
        const storedUser = getUserFromLocalStorage();
        if (storedUser)
        {
            setUserState(storedUser);
        }
    }, []);

    const setUser = (user: User) =>
    {
        setUserState(user);
        setUserInLocalStorage(user);
    };

    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType =>
{
    const context = useContext(UserContext);
    if (!context)
    {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
