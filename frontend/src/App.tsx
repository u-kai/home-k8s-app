import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import { AuthProvider } from "./AuthProvider";
import { AppErrorContextProvider } from "./contexts/error";
import { UserContextProvider } from "./contexts/user";
import { WordBookContextProvider } from "./contexts/wordbook";
export const App = () => {
  return (
    <AppErrorContextProvider>
      <UserContextProvider>
        <WordBookContextProvider>
          <Authenticator.Provider>
            <AuthProvider />
          </Authenticator.Provider>
        </WordBookContextProvider>
      </UserContextProvider>
    </AppErrorContextProvider>
  );
};
