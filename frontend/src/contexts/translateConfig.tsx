import React, { createContext, ReactNode, useState } from "react";

type TranslateConfig = {
  autoMeaning: boolean;
  autoSentence: boolean;
};

export type TranslateConfigContextType = {
  translateConfig: TranslateConfig;
  setTranslateConfig: React.Dispatch<React.SetStateAction<TranslateConfig>>;
};
type ParentProps = {
  children: ReactNode;
};
export const TranslateConfigContext = createContext<TranslateConfigContextType>(
  {} as TranslateConfigContextType
);
export const TranslateConfigContextProvider: React.FC<ParentProps> = ({
  children,
}) => {
  const [translateConfig, setTranslateConfig] = useState<TranslateConfig>({
    autoMeaning: true,
    autoSentence: true,
  });
  return (
    <TranslateConfigContext.Provider
      value={{
        translateConfig,
        setTranslateConfig,
      }}
    >
      {children}
    </TranslateConfigContext.Provider>
  );
};
