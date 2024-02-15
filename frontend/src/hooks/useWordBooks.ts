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

  return {
    wordbook,
    fetchAll,
    sortByCreatedAt,
    registerWordProfile,
  };
};
