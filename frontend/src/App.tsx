import React from "react";
import { AuthProvider } from "./AuthProvider";
import { UserContextProvider } from "./contexts/user";
import { WordBookContextProvider } from "./contexts/wordbook";
import { Home } from "./Home";
export const App = () => {
  return (
    <UserContextProvider>
      <WordBookContextProvider>
        <AuthProvider />;
      </WordBookContextProvider>
    </UserContextProvider>
  );
};
