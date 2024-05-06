import React, { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";
import { SentenceProfile, WordProfile } from "../../../../contexts/wordbook";
import { AppErrorContext } from "../../../../contexts/error";
import { UserContext } from "../../../../contexts/user";
import { useWordBook } from "../../../../hooks/useWordBooks";
import {
  generateSentence,
  ToLang,
  translateRequest,
} from "../../../../clients/translate";
import {
  RegisteredWordProfile,
  RegisterModal,
} from "../../../Registers/elements/Modal";

export type UpdateWordProfileModalProps = {
  updateTarget: WordProfile;
  open: boolean;
  handleClose: () => void;
};

export const UpdateWordProfileModal = (props: UpdateWordProfileModalProps) => {
  const { user } = useContext(UserContext);
  const { setAppError } = useContext(AppErrorContext);
  const { updateWordProfile } = useWordBook();
  const errorHandler = (error: Error) => {
    setAppError({
      name: error.name,
      message: error.message,
      id: "update",
    });
  };

  const translateHandler = async (req: {
    word: string;
    toLang: ToLang;
  }): Promise<string> => {
    const translated = await translateRequest(req, user.token ?? "");
    if (!translated) {
      errorHandler(new Error("Failed to translate"));
    }
    return translated;
  };
  const createSentenceHandler = async (
    word: string
  ): Promise<{ value: string; meaning: string }> => {
    const generated = await generateSentence(
      {
        word,
        toLang: "en",
      },
      user.token ?? ""
    );
    if (!generated) {
      errorHandler(new Error("Failed to generate sentence"));
    }
    return {
      value: generated.sentence,
      meaning: generated.meaning,
    };
  };
  const registerHandler = async (target: RegisteredWordProfile) => {
    const convert = (sentence: {
      value: string;
      meaning: string;
      pronunciation?: string;
      index: number;
    }): SentenceProfile => {
      return {
        sentenceId: props.updateTarget.sentences[sentence.index].sentenceId,
        sentence: {
          value: sentence.value,
          meaning: sentence.meaning,
          pronunciation: sentence.pronunciation ?? "",
        },
        createdAt: props.updateTarget.sentences[sentence.index].createdAt,
        updatedAt: new Date().getSeconds(),
      };
    };
    updateWordProfile({
      word: {
        value: target.word,
        meaning: target.meaning,
        pronunciation: target.pronunciation ?? "",
      },
      sentences: target.sentences.map((v, i) => convert({ ...v, index: i })),
      // add old properties
      wordId: props.updateTarget.wordId,
      remarks: target.remarks,
      createdAt: props.updateTarget.createdAt,
      updatedAt: new Date().getSeconds(),
      missCount: props.updateTarget.missCount,
      likeRates: props.updateTarget.likeRates,
    });
  };

  return (
    <RegisterModal
      open={props.open}
      handleClose={props.handleClose}
      registerHandler={registerHandler}
      translateHandler={translateHandler}
      createSentenceHandler={createSentenceHandler}
      init={
        {
          word: props.updateTarget.word.value,
          meaning: props.updateTarget.word.meaning,
          pronunciation: props.updateTarget.word.pronunciation,
          remarks: props.updateTarget.remarks,
          sentences: props.updateTarget.sentences.map((sentence) => {
            return {
              value: sentence.sentence.value,
              meaning: sentence.sentence.meaning,
              pronunciation: sentence.sentence.pronunciation,
            };
          }),
        } as RegisteredWordProfile
      }
      errorHandler={errorHandler}
    />
  );
};

export const textFieldStyle = {
  width: "80%",
  marginTop: "3px",
};

const MeaningTextAndAiContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;
export const TextFieldContainer = styled.div`
  width: 90%;
  margin-top: 3px;
  justify-content: center;
  flex-direction: column;
`;
