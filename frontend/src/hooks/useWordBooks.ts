import { useContext } from "react";
import {
  Sentence,
  SentenceProfile,
  WordBookContext,
  WordProfile,
} from "../contexts/wordbook";
import {
  authorizationHeader,
  backendUrl,
  fetchJsonWithCors,
  isFailed,
  Result,
} from "../clients/fetch";

export type RegisterWordRequest = {
  word: string;
  meaning: string;
  pronunciation?: string;
  remarks: string;
  sentences: Sentence[];
};

export type UpdateWordRequest = {
  wordId: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  remarks: string;
  missCount: number;
  likeRates: LikeRates;
  sentences: {
    sentenceId: string;
    value: string;
    meaning: string;
    pronunciation?: string;
  }[];
};

const wordbookUrl = (path: string) => {
  return backendUrl(`/wordbook${path}`);
};

export type FetchAll = () => Promise<Result<WordProfile[]>>;

export const fetchAllWordProfiles = (token: string): FetchAll => {
  return async () => {
    const response: Result<{ result: WordProfile[] }> = await fetchJsonWithCors<
      null,
      { result: WordProfile[] }
    >({
      url: wordbookUrl("/words"),
      method: "GET",
      headers: authorizationHeader(token),
    });

    if (isFailed(response)) {
      return new Error("Failed to fetch wordbook." + response.toString());
    }
    return response.result;
  };
};

export type RegisterWordProfile = (
  req: RegisterWordRequest
) => Promise<Result<WordProfile>>;

export const registerWordProfile = (token: string): RegisterWordProfile => {
  return async (req: RegisterWordRequest) => {
    const response = await fetchJsonWithCors<
      RegisterWordRequest,
      { result: WordProfile }
    >({
      url: wordbookUrl("/registerWord"),
      method: "POST",
      body: req,
      headers: authorizationHeader(token),
    });
    if (isFailed(response)) {
      return new Error(
        "Failed to register word profile." + response.toString()
      );
    }
    return response.result;
  };
};

export type UpdateWordProfile = (
  wordProfile: WordProfile
) => Promise<Result<WordProfile>>;

export const updateWordProfile = (token: string): UpdateWordProfile => {
  return async (wordProfile: WordProfile) => {
    const req: UpdateWordRequest = {
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
    const response = await fetchJsonWithCors<
      UpdateWordRequest,
      { result: WordProfile }
    >({
      url: wordbookUrl("/updateWord"),
      method: "POST",
      body: req,
      headers: authorizationHeader(token),
    });
    if (isFailed(response)) {
      return new Error("Failed to update word profile." + response.toString());
    }
    return response.result;
  };
};

export type DeleteWordProfile = (req: {
  userId: string;
  wordId: string;
}) => Promise<Result<void>>;

export const deleteWordProfile = (token: string): DeleteWordProfile => {
  return async (req: { userId: string; wordId: string }) => {
    const response = await fetchJsonWithCors<
      { wordId: string; userId: string },
      { result: string }
    >({
      url: wordbookUrl("/deleteWord"),
      method: "POST",
      body: req,
      headers: authorizationHeader(token),
    });
    if (isFailed(response)) {
      return new Error("Failed to delete word profile." + response.toString());
    }
  };
};

export const useWordBook = () => {
  const { wordbook, setWordBook } = useContext(WordBookContext);
  // API Requests
  // Fetch All is called when the page is loaded.
  // It fetches all the word profiles from the server and set the wordbook state.
  const fetchAll = async (client: FetchAll): Promise<Result<void>> => {
    if (wordbook.length > 0) {
      return;
    }
    const response = await client();
    if (isFailed(response)) {
      return new Error("Failed to fetch wordbook." + response.toString());
    }
    setWordBook(response);
  };

  const registerWordProfile = async (
    client: RegisterWordProfile,
    req: RegisterWordRequest
  ): Promise<Result<void>> => {
    const duplicate = wordbook.find((word) => word.word.value === req.word);
    if (duplicate) {
      return new Error("The word is already registered.");
    }
    const response = await client(req);
    if (isFailed(response)) {
      return new Error(
        "Failed to register word profile." + response.toString()
      );
    }
    setWordBook([response, ...wordbook]);
  };

  const updateWordProfile = async (
    client: UpdateWordProfile,
    wordProfile: WordProfile
  ): Promise<Result<void>> => {
    const response = await client(wordProfile);
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

  const deleteWordProfile = async (
    client: DeleteWordProfile,
    req: { wordId: string; userId: string }
  ): Promise<Result<void>> => {
    const response = await client(req);
    if (isFailed(response)) {
      return new Error("Failed to delete word profile." + response.toString());
    }
    const newWordBook = wordbook.filter((word) => word.wordId !== req.wordId);
    setWordBook(newWordBook);
    return;
  };

  // use search input end
  const wordToTop = (wordId: string) => {
    const word = wordbook.find((word) => word.wordId === wordId);
    if (!word) {
      return;
    }
    const newWordBook = wordbook.filter((word) => word.wordId !== wordId);
    newWordBook.unshift(word);
    setWordBook(newWordBook);
  };

  // sort functions
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

  return {
    wordbook,
    wordToTop,
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

export const emptySentence: SentenceProfile = {
  sentenceId: "",
  sentence: {
    value: "",
    meaning: "",
    pronunciation: "",
  },
  createdAt: new Date().getTime(),
  updatedAt: 0,
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
