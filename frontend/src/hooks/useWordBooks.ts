import { useContext } from "react";
import {
  Sentence,
  Word,
  WordBookContext,
  WordProfile,
} from "../contexts/wordbook";
import { fetchJsonWithCors, wordbookUrl } from "../fetch";

type RequestResult<T> = T | Error;

export const isSuccessful = <T>(result: RequestResult<T>): result is T => {
  return !(result instanceof Error);
};

export type RegisterWordRequest = {
  userId: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  remarks: string;
  sentences: Sentence[];
};

export type UpdateWordRequest = {
  userId: string;
  wordId: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  remarks: string;
  missCount: number;
  sentences: {
    sentenceId: string;
    value: string;
    meaning: string;
    pronunciation?: string;
  }[];
};

export const useWordBook = () => {
  const { wordbook, setWordBook } = useContext(WordBookContext);

  const fetchAll = async (userId: string): Promise<RequestResult<void>> => {
    try {
      const response: WordProfile[] = await fetchJsonWithCors({
        url: wordbookUrl("/words?userId=" + userId),
        method: "GET",
      });
      console.log("words response:", response);
      setWordBook(response);
    } catch (e: any) {
      return new Error(e.toString());
    }
  };
  const sortByCreatedAt = () => {
    const sorted = wordbook.slice().sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    setWordBook(sorted);
  };

  const deleteWordProfile = async (req: {
    userId: string;
    wordId: string;
  }): Promise<RequestResult<void>> => {
    try {
      const _response = await fetchJsonWithCors({
        url: wordbookUrl("/deleteWord"),
        method: "POST",
        body: req,
      });
      const newWordBook = wordbook.filter((word) => word.wordId !== req.wordId);
      setWordBook(newWordBook);
      return;
    } catch (e: any) {
      return new Error(e.toString());
    }
  };

  const registerWordProfile = async (
    req: RegisterWordRequest
  ): Promise<RequestResult<void>> => {
    try {
      const response = await fetchJsonWithCors({
        url: wordbookUrl("/registerWord"),
        method: "POST",
        body: req,
      });
      setWordBook([...wordbook, response]);
    } catch (e: any) {
      return new Error(e.toString());
    }
  };

  const updateWordProfile = async (
    userId: string,
    wordProfile: WordProfile
  ): Promise<RequestResult<void>> => {
    const req: UpdateWordRequest = {
      userId: userId,
      wordId: wordProfile.wordId,
      word: wordProfile.word.value,
      meaning: wordProfile.word.meaning,
      pronunciation: wordProfile.word.pronunciation,
      remarks: wordProfile.remarks,
      missCount: wordProfile.missCount,
      sentences: wordProfile.sentences.map((sentence) => {
        return {
          sentenceId: sentence.sentenceId,
          value: sentence.sentence.value,
          meaning: sentence.sentence.meaning,
          pronunciation: sentence.sentence.pronunciation,
        };
      }),
    };
    try {
      const response = await fetchJsonWithCors({
        url: wordbookUrl("/updateWord"),
        method: "POST",
        body: req,
      });
      setWordBook([...wordbook, response]);
      return;
    } catch (e: any) {
      return new Error(e.toString());
    }
  };
  return {
    wordbook,
    fetchAll,
    sortByCreatedAt,
    deleteWordProfile,
    registerWordProfile,
    updateWordProfile,
  };
};
