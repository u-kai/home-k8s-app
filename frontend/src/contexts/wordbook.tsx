import React, { createContext, ReactNode, useState } from "react";

export type WordBook = WordProfile[];

export type WordProfile = {
  wordId: string;
  word: Word;
  missCount: number;
  remarks: string;
  createdAt: number;
  updatedAt: number;
  sentences: SentenceProfile[];
};
type Word = {
  value: string;
  meaning: string;
  pronunciation: string;
};
type SentenceProfile = {
  sentenceId: string;
  sentence: Sentence;
  createdAt: number;
  updatedAt: number;
};
type Sentence = {
  value: string;
  meaning: string;
  pronunciation: string;
};
export type WordBookContextType = {
  wordbook: WordBook;
  setWordBook: React.Dispatch<React.SetStateAction<WordBook>>;
};
type ParentProps = {
  children: ReactNode;
};
export const WordBookContext = createContext<WordBookContextType>(
  {} as WordBookContextType
);

export const WordBookContextProvider: React.FC<ParentProps> = ({
  children,
}) => {
  const [wordbook, setWordBook] = useState<WordBook>([]);

  return (
    <WordBookContext.Provider value={{ wordbook, setWordBook }}>
      {children}
    </WordBookContext.Provider>
  );
};
