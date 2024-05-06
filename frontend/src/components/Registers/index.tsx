import React, { useContext } from "react";
import { styled } from "styled-components";
import { RegisterModal } from "./elements/Modal/index";
import { RegisterButtons } from "./elements/RegisterButton";
import { UserContext } from "../../contexts/user";
import { AppErrorContext } from "../../contexts/error";
import { RegisteredWordProfile } from "./elements/Modal";
import {
  generateSentence,
  ToLang,
  translateRequest,
} from "../../clients/translate";
import { useWordBook } from "../../hooks/useWordBooks";
import { Sentence } from "../../contexts/wordbook";

export const Registers = () => {
  const [open, setOpen] = React.useState(false);
  const { user } = useContext(UserContext);
  const { setAppError } = useContext(AppErrorContext);
  const { registerWordProfile } = useWordBook();
  const errorHandler = (error: Error) => {
    setAppError({
      name: error.name,
      message: error.message,
      id: "register",
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
    }): Sentence => {
      return {
        value: sentence.value,
        meaning: sentence.meaning,
        pronunciation: sentence.pronunciation ?? "",
      };
    };
    registerWordProfile({
      word: target.word,
      meaning: target.meaning,
      pronunciation: target.pronunciation ?? "",
      remarks: target.remarks,
      sentences: target.sentences.map(convert),
    });
  };
  return (
    <Container>
      <RegisterButtons handler={() => setOpen((prev) => !prev)} />
      <RegisterModal
        open={open}
        handleClose={() => setOpen(false)}
        registerHandler={registerHandler}
        translateHandler={translateHandler}
        createSentenceHandler={createSentenceHandler}
        errorHandler={errorHandler}
      />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
`;
