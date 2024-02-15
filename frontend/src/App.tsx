import React from "react";
import { AuthProvider } from "./AuthProvider";
import { UserContextProvider } from "./contexts/user";
import { Home } from "./Home";
export const App = () => {
  return <AuthProvider />;
};
