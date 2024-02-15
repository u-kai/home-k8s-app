import { useContext } from "react";
import { WordBookContext, WordProfile } from "../contexts/wordbook";
import { fetchJsonWithCors, wordbookUrl } from "../fetch";

type RequestResult<T> = T | Error;

export const isSuccessful = <T>(result: RequestResult<T>): result is T => {
  return !(result instanceof Error);
};

export const useWordBook = () => {
  const { wordbook, setWordBook } = useContext(WordBookContext);

  const fetchAll = async (userId: string): Promise<RequestResult<void>> => {
    try {
      const response: WordProfile[] = await fetchJsonWithCors({
        url: wordbookUrl("/words?userId=" + userId),
        method: "GET",
      });
      setWordBook(response);
    } catch (e: any) {
      return new Error(e.toString());
    }
  };
  return { wordbook, fetchAll };
};
