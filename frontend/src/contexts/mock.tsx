import React from "react";
import {
  DeleteWordProfile,
  FetchAll,
  LikeRates,
  RegisterWordProfile,
  UpdateWordProfile,
} from "../hooks/useWordBooks";
import { UserContext } from "./user";
import { WordBookContext, WordProfile } from "./wordbook";

export const mockWord: WordProfile = {
  wordId: "1",
  word: {
    value: "test",
    meaning: "テスト",
    pronunciation: "mock",
  },
  createdAt: 0,
  updatedAt: 0,
  remarks: "mock",
  likeRates: "Very Good" as LikeRates,
  sentences: [
    {
      sentenceId: "1",
      sentence: {
        value: "this is a test sentence",
        meaning: "これはテストの文です",
        pronunciation: "mock",
      },
      createdAt: 0,
      updatedAt: 0,
    },
  ],
  missCount: 0,
};

const baseMockWordBook: WordProfile[] = Array(100)
  .fill({})
  .map((_, i) => {
    return {
      ...mockWord,
      word: {
        value: mockWord.word.value + i.toString(),
        meaning: mockWord.word.meaning,
        pronunciation: mockWord.word.pronunciation,
      },
      wordId: i.toString(),
      sentences: [
        {
          ...mockWord.sentences[0],
          sentenceId: i.toString(),
        },
      ],
    };
  });

const mockUser = {
  id: "mockId",
  token: "mockToken",
  name: "mockName",
};

export const mockFetchAll: FetchAll = async () => {
  return baseMockWordBook.map((word) => {
    return {
      ...word,
      word: {
        ...word.word,
        value: "fetched" + word.word.value,
      },
    };
  });
};

export const mockDeleteWordProfile: DeleteWordProfile = async (req: {
  wordId: string;
  userId: string;
}) => {};

export const mockUpdateWordProfile: UpdateWordProfile = async (
  wordProfile: WordProfile
) => {
  return wordProfile;
};

export const mockRegisterWordProfile: RegisterWordProfile = async (req: {
  word: string;
  meaning: string;
  pronunciation?: string;
  remarks: string;
  sentences: {
    value: string;
    meaning: string;
    pronunciation: string;
  }[];
}) => {
  return {
    ...mockWord,
    word: {
      ...mockWord.word,
      value: req.word,
      meaning: req.meaning,
      pronunciation: req.pronunciation ?? "",
    },
    remarks: req.remarks,
    sentences: req.sentences.map((sentence) => {
      return {
        sentenceId: "newSentenceId",
        sentence: {
          value: sentence.value,
          meaning: sentence.meaning,
          pronunciation: sentence.pronunciation,
        },
        createdAt: 0,
        updatedAt: 0,
      };
    }),
  };
};
export const MockWordBookContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [mockWordBook, setMockWordBook] =
    React.useState<WordProfile[]>(baseMockWordBook);
  return (
    <UserContext.Provider value={{ user: mockUser, setUser: () => {} }}>
      <WordBookContext.Provider
        value={{ wordbook: mockWordBook, setWordBook: setMockWordBook }}
      >
        {props.children}
      </WordBookContext.Provider>
    </UserContext.Provider>
  );
};
