import { useContext } from "react";
import { Sentence, WordBookContext, WordProfile } from "../contexts/wordbook";
import { fetchJsonWithCors, isFailed, Result, wordbookUrl } from "../fetch";

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

  const fetchAll = async (userId: string): Promise<Result<void>> => {
    const response: Result<WordProfile[]> = await fetchJsonWithCors<
      undefined,
      WordProfile[]
    >({
      url: wordbookUrl("/words?userId=" + userId),
      method: "GET",
    });
    if (isFailed(response)) {
      return new Error("Failed to fetch wordbook." + response.toString());
    }
    setWordBook(response);
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
  }): Promise<Result<void>> => {
    const response = await fetchJsonWithCors({
      url: wordbookUrl("/deleteWord"),
      method: "POST",
      body: req,
    });
    if (isFailed(response)) {
      return new Error("Failed to delete word profile." + response.toString());
    }
    const newWordBook = wordbook.filter((word) => word.wordId !== req.wordId);
    setWordBook(newWordBook);
    return;
  };

  const registerWordProfile = async (
    req: RegisterWordRequest
  ): Promise<Result<void>> => {
    const response = await fetchJsonWithCors<RegisterWordRequest, WordProfile>({
      url: wordbookUrl("/registerWord"),
      method: "POST",
      body: req,
    });
    if (isFailed(response)) {
      return new Error(
        "Failed to register word profile." + response.toString()
      );
    }
    setWordBook([...wordbook, response]);
  };

  const updateWordProfile = async (
    userId: string,
    wordProfile: WordProfile
  ): Promise<Result<void>> => {
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
    const response = await fetchJsonWithCors<UpdateWordRequest, WordProfile>({
      url: wordbookUrl("/updateWord"),
      method: "POST",
      body: req,
    });
    if (isFailed(response)) {
      return new Error("Failed to update word profile." + response.toString());
    }
    setWordBook([...wordbook, response]);
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
