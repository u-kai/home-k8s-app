import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./contexts/user";
import { Home } from "./Home";
import { Login } from "./Login";

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route path="" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
};
