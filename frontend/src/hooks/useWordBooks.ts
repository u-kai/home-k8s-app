import { useContext } from "react";
import { UserContext } from "../contexts/user";
import { Sentence, WordBookContext, WordProfile } from "../contexts/wordbook";
import {
  authorizationHeader,
  fetchJsonWithCors,
  isFailed,
  Result,
  wordbookUrl,
} from "../fetch";

export type RegisterWordRequest = {
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
  likeRates: string;
  sentences: {
    sentenceId: string;
    value: string;
    meaning: string;
    pronunciation?: string;
  }[];
};

export const useWordBook = () => {
  const { wordbook, setWordBook } = useContext(WordBookContext);
  const { user } = useContext(UserContext);
  const authHeader = authorizationHeader(user.token ?? "");
  const fetchAll = async (): Promise<Result<void>> => {
    if (wordbook.length > 0) {
      return;
    }
    const response: Result<WordProfile[]> = await fetchJsonWithCors<
      undefined,
      WordProfile[]
    >({
      url: wordbookUrl("/words?userId=" + user.id),
      method: "GET",
      headers: authHeader,
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
    wordId: string;
  }): Promise<Result<void>> => {
    const response = await fetchJsonWithCors({
      url: wordbookUrl("/deleteWord"),
      method: "POST",
      body: { ...req, userId: user.id },
      headers: authHeader,
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
    const response = await fetchJsonWithCors<
      RegisterWordRequest & { userId: string },
      WordProfile
    >({
      url: wordbookUrl("/registerWord"),
      method: "POST",
      body: { ...req, userId: user.id },
      headers: authHeader,
    });
    if (isFailed(response)) {
      return new Error(
        "Failed to register word profile." + response.toString()
      );
    }
    setWordBook([...wordbook, response]);
  };

  const updateWordProfile = async (
    wordProfile: WordProfile
  ): Promise<Result<void>> => {
    const req: UpdateWordRequest = {
      userId: user.id,
      wordId: wordProfile.wordId,
      word: wordProfile.word.value,
      meaning: wordProfile.word.meaning,
      pronunciation: wordProfile.word.pronunciation,
      remarks: wordProfile.remarks,
      missCount: wordProfile.missCount,
      likeRates: wordProfile.likeRates,
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
      headers: authHeader,
    });
    if (isFailed(response)) {
      return new Error("Failed to update word profile." + response.toString());
    }
    const newWordBook = wordbook.map((word) => {
      if (word.wordId === response.wordId) {
        return response;
      }
      return word;
    });
    setWordBook(newWordBook);
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
