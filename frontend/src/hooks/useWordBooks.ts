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
export type LikeRates = "veryGood" | "good" | "normal" | "bad" | "veryBad";
const DEFAULT_RATE = "normal";

export const toLikeRatesFromStr = (rate: string): LikeRates => {
  if (rate === "veryBad") {
    return "veryBad";
  }
  if (rate === "bad") {
    return "bad";
  }
  if (rate === "normal") {
    return "normal";
  }
  if (rate === "good") {
    return "good";
  }
  if (rate === "veryGood") {
    return "veryGood";
  }
  return DEFAULT_RATE;
};

export const toLikeRates = (rate: number): LikeRates => {
  if (rate === 1) {
    return "veryBad";
  }
  if (rate === 2) {
    return "bad";
  }
  if (rate === 3) {
    return "normal";
  }
  if (rate === 4) {
    return "good";
  }
  if (rate === 5) {
    return "veryGood";
  }
  return DEFAULT_RATE;
};
export const fromLikeRates = (rate: LikeRates): number => {
  if (rate === "veryBad") {
    return 1;
  }
  if (rate === "bad") {
    return 2;
  }
  if (rate === "normal") {
    return 3;
  }
  if (rate === "good") {
    return 4;
  }
  if (rate === "veryGood") {
    return 5;
  }
  return 3;
};
export type TopOrBottom = "top" | "bottom";
export const reverse = (v: TopOrBottom) => (v === "top" ? "bottom" : "top");

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
  const sortByCreatedAt = (topOrBottom: TopOrBottom) => {
    const sortTopFn = (a: WordProfile, b: WordProfile) => {
      return b.createdAt - a.createdAt;
    };
    const sortBottomFn = (a: WordProfile, b: WordProfile) => {
      return a.createdAt - b.createdAt;
    };
    const sortFn = topOrBottom === "top" ? sortTopFn : sortBottomFn;
    const sorted = wordbook.slice().sort((a, b) => {
      return sortFn(a, b);
    });
    setWordBook(sorted);
  };
  const sortByUpdatedAt = (topOrBottom: TopOrBottom) => {
    const sortTopFn = (a: WordProfile, b: WordProfile) => {
      return b.updatedAt - a.updatedAt;
    };
    const sortBottomFn = (a: WordProfile, b: WordProfile) => {
      return a.updatedAt - b.updatedAt;
    };
    const sortFn = topOrBottom === "top" ? sortTopFn : sortBottomFn;
    const sorted = wordbook.slice().sort((a, b) => {
      return sortFn(a, b);
    });
    setWordBook(sorted);
  };
  const sortByLikeRates = (topOrBottom: TopOrBottom) => {
    const sortTopFn = (a: WordProfile, b: WordProfile) => {
      return (
        fromLikeRates(toLikeRatesFromStr(b.likeRates)) -
        fromLikeRates(toLikeRatesFromStr(a.likeRates))
      );
    };
    const sortBottomFn = (a: WordProfile, b: WordProfile) => {
      return (
        fromLikeRates(toLikeRatesFromStr(a.likeRates)) -
        fromLikeRates(toLikeRatesFromStr(b.likeRates))
      );
    };
    const sorted = wordbook.slice().sort((a, b) => {
      return topOrBottom === "top" ? sortTopFn(a, b) : sortBottomFn(a, b);
    });
    setWordBook(sorted);
  };

  const sortByWord = (topOrBottom: TopOrBottom) => {
    const sortTopFn = (a: WordProfile, b: WordProfile) => {
      return a.word.value.localeCompare(b.word.value);
    };
    const sortBottomFn = (a: WordProfile, b: WordProfile) => {
      return b.word.value.localeCompare(a.word.value);
    };
    const sortFn = topOrBottom === "top" ? sortTopFn : sortBottomFn;

    const sorted = wordbook.slice().sort((a, b) => {
      return sortFn(a, b);
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
    sortByLikeRates,
    sortByWord,
    sortByUpdatedAt,
    deleteWordProfile,
    registerWordProfile,
    updateWordProfile,
  };
};
