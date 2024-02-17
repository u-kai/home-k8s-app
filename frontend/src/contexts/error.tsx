import React, { createContext, ReactNode, useState } from "react";

type AppError = {
  id: string;
  name: string;
  message: string;
};

export type AppErrorContextType = {
  appError: AppError | undefined;
  setAppError: React.Dispatch<React.SetStateAction<AppError | undefined>>;
};
type ParentProps = {
  children: ReactNode;
};
export const AppErrorContext = createContext<AppErrorContextType>(
  {} as AppErrorContextType
);

export const AppErrorContextProvider: React.FC<ParentProps> = ({
  children,
}) => {
  const [appError, setAppError] = useState<AppError | undefined>(undefined);
  return (
    <AppErrorContext.Provider value={{ appError, setAppError }}>
      {children}
    </AppErrorContext.Provider>
  );
};
