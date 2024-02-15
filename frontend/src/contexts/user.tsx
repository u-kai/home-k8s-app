import React, { createContext, ReactNode, useState } from "react";

type User = {
  id: string;
  name: string;
  email?: string;
};

export type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};
type ParentProps = {
  children: ReactNode;
};
export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);
export const UserContextProvider: React.FC<ParentProps> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
