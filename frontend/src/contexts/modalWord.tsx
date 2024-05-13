import React, { createContext, ReactNode } from "react";
import { SentenceProfile, WordProfile } from "./wordbook";

export type NotRegisteredWordProfile = {
  word: {
    value: string;
    meaning: string;
    pronunciation: string;
  };
  sentences: {
    value: string;
    meaning: string;
    pronunciation: string;
  }[];
  remarks: string;
};

export const sentenceValue = (
  sentence: { value: string; meaning: string } | SentenceProfile
) => {
  if ("sentence" in sentence) {
    return sentence.sentence.value;
  }
  return sentence.value;
};

export type Modal = {
  open: boolean;
  word: WordProfile | NotRegisteredWordProfile;
};

export const isWordProfile = (
  word?: WordProfile | NotRegisteredWordProfile
): word is WordProfile => {
  return word !== undefined && (word as WordProfile).wordId !== undefined;
};

const setWordValueToWordProfile = (
  word: WordProfile,
  value: string
): WordProfile => {
  return {
    ...word,
    word: {
      ...word.word,
      value: value,
    },
  };
};
const setMeaningValueToWordProfile = (
  word: WordProfile,
  meaning: string
): WordProfile => {
  return {
    ...word,
    word: {
      ...word.word,
      meaning: meaning,
    },
  };
};

const setSentenceValueToWordProfile = (
  word: WordProfile,
  sentence: { index: number; value?: string; meaning?: string }
): WordProfile => {
  const index = sentence.index;
  const value = sentence.value ?? word.sentences[index].sentence.value;
  const meaning = sentence.meaning ?? word.sentences[index].sentence.meaning;
  const newSentences = word.sentences.map((sentence, i) => {
    if (i === index) {
      return {
        ...sentence,
        sentence: {
          value: value,
          meaning: meaning,
          pronunciation: sentence.sentence.pronunciation,
        },
      };
    }
    return sentence;
  });
  return {
    ...word,
    sentences: newSentences,
  };
};

// TODO: すでに存在している単語に新たに例文を追加するとき、今のままだとWordProfile型として作成されてしまうが、
// 新しく追加される例文にはidなどがないため、WordProfileではなく別の型で管理する必要がある
//const newSentenceValueToWordProfile = (
//  word: WordProfile,
//  value: string
//): WordProfile => {
//  return {
//    ...word,
//    sentences: [...word.sentences, newSentence],
//  };
//};

const deleteSentenceToWordProfile = (
  word: WordProfile,
  index: number
): WordProfile => {
  const newSentences = word.sentences.filter((_, i) => i !== index);
  return {
    ...word,
    sentences: newSentences,
  };
};

const setWordValueToNotRegisteredWordProfile = (
  word: NotRegisteredWordProfile,
  value: string
): NotRegisteredWordProfile => {
  return {
    ...word,
    word: {
      ...word.word,
      value: value,
    },
  };
};

const setMeaningValueToNotRegisteredWordProfile = (
  word: NotRegisteredWordProfile,
  meaning: string
): NotRegisteredWordProfile => {
  return {
    ...word,
    word: {
      ...word.word,
      meaning: meaning,
    },
  };
};
const setSentenceValueToNotRegisteredWordProfile = (
  word: NotRegisteredWordProfile,
  sentence: { index: number; value?: string; meaning?: string }
): NotRegisteredWordProfile => {
  const index = sentence.index;
  const value = sentence.value ?? word.sentences[index].value;
  const meaning = sentence.meaning ?? word.sentences[index].meaning;
  const newSentences = word.sentences.map((sentence, i) => {
    if (i === index) {
      return {
        value: value,
        meaning: meaning,
        pronunciation: sentence.pronunciation,
      };
    }
    return sentence;
  });
  return {
    ...word,
    sentences: newSentences,
  };
};

const setNewSentenceValueToNotRegisteredWordProfile = (
  word: NotRegisteredWordProfile,
  value: string
): NotRegisteredWordProfile => {
  return {
    ...word,
    sentences: [
      ...word.sentences,
      { value: value, meaning: "", pronunciation: "" },
    ],
  };
};

const deleteSentenceToNotRegisteredWordProfile = (
  word: NotRegisteredWordProfile,
  index: number
): NotRegisteredWordProfile => {
  if (word.sentences.length === 1) {
    return {
      ...word,
      sentences: [{ value: "", meaning: "", pronunciation: "" }],
    };
  }
  const newSentences = word.sentences.filter((_, i) => i !== index);
  return {
    ...word,
    sentences: newSentences,
  };
};

const init: NotRegisteredWordProfile = {
  word: {
    value: "",
    meaning: "",
    pronunciation: "",
  },
  sentences: [
    {
      value: "",
      meaning: "",
      pronunciation: "",
    },
  ],
  remarks: "",
};

type ActionType =
  | "open"
  | "update"
  | "openWith"
  | "close"
  | "setWordValue"
  | "setWordMeaning"
  | "setSentenceValue"
  | "addNewSentence"
  | "deleteSentence";

type ModalPayload = {
  setWordValue?: string;
  setWordMeaning?: string;
  updateTarget?: WordProfile;
  openWith?: NotRegisteredWordProfile;
  setSentenceValue?: {
    index: number;
    value?: string;
    meaning?: string;
  };
  deleteSentence?: {
    index: number;
  };
};

const reducer = (
  state: Modal,
  action: { type: ActionType; payload?: ModalPayload }
): Modal => {
  switch (action.type) {
    case "open":
      return {
        open: true,
        word: init,
      };
    case "openWith":
      return {
        open: true,
        // update must be called with a payload
        word: action.payload!.openWith!,
      };
    case "update":
      return {
        open: true,
        // update must be called with a payload
        word: action.payload!.updateTarget!,
      };
    case "close":
      return {
        open: false,
        word: init,
      };
    case "setWordValue": {
      const word = state.word;
      // case edit existing word
      if (isWordProfile(word)) {
        const newState = {
          open: true,
          word: setWordValueToWordProfile(word, action.payload!.setWordValue!),
        };
        return newState;
      }
      // case edit new word
      const wordValue = action.payload!.setWordValue!;
      return {
        open: true,
        word: setWordValueToNotRegisteredWordProfile(word, wordValue),
      };
    }
    case "setWordMeaning": {
      const word = state.word;
      // case edit existing word
      if (isWordProfile(word)) {
        const newState = {
          open: true,
          word: setMeaningValueToWordProfile(
            word,
            action.payload!.setWordMeaning!
          ),
        };
        return newState;
      }
      // case edit new word
      const meaning = action.payload!.setWordMeaning!;
      return {
        open: true,
        word: setMeaningValueToNotRegisteredWordProfile(word, meaning),
      };
    }
    case "setSentenceValue": {
      const word = state.word;
      if (isWordProfile(word)) {
        const newState = {
          open: true,
          word: setSentenceValueToWordProfile(
            word,
            action.payload!.setSentenceValue!
          ),
        };
        return newState;
      }
      return {
        open: true,
        word: setSentenceValueToNotRegisteredWordProfile(
          word,
          action.payload!.setSentenceValue!
        ),
      };
    }
    case "addNewSentence":
      const word = state.word;
      if (isWordProfile(word)) {
        const newWordProfile: WordProfile = {
          ...word,
          sentences: [
            ...word.sentences,
            {
              sentenceId: "",
              sentence: {
                value: "",
                meaning: "",
                pronunciation: "",
              },
              createdAt: -1,
              updatedAt: -1,
            },
          ],
        };
        return {
          open: true,
          word: newWordProfile,
        };
      }
      return {
        open: true,
        word: setNewSentenceValueToNotRegisteredWordProfile(word, ""),
      };
    case "deleteSentence": {
      const word = state.word;
      if (isWordProfile(word)) {
        const newState = {
          open: true,
          word: deleteSentenceToWordProfile(
            word,
            action.payload!.deleteSentence!.index
          ),
        };
        return newState;
      }
      return {
        open: true,
        word: deleteSentenceToNotRegisteredWordProfile(
          word,
          action.payload!.deleteSentence!.index
        ),
      };
    }
    default:
      return state;
  }
};

export type ModalContextType = {
  modalWord: Modal;
  modalWordDispatch: React.Dispatch<{
    type: ActionType;
    payload?: ModalPayload;
  }>;
};
type ParentProps = {
  children: ReactNode;
};
export const ModalContext = createContext<ModalContextType>(
  {} as ModalContextType
);
export const ModalContextProvider: React.FC<ParentProps> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    open: false,
    word: init,
  });
  return (
    <ModalContext.Provider
      value={{ modalWord: state, modalWordDispatch: dispatch }}
    >
      {children}
    </ModalContext.Provider>
  );
};
