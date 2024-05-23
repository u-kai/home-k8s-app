import React, { useContext } from "react";
import { styled } from "styled-components";
import { RegisterModal } from "./elements/index";
import { UserContext } from "../../contexts/user";
import { AppErrorContext } from "../../contexts/error";
import {
  generateSentence,
  ToLang,
  translateRequest,
} from "../../clients/translate";
import {
  registerWordProfile as registerClient,
  updateWordProfile as updateClient,
} from "../../hooks/useWordBooks";
import { AddButton } from "../Button/AddButton";

export const Registers = () => {
  const [open, setOpen] = React.useState(false);
  const { user } = useContext(UserContext);
  const { setAppError } = useContext(AppErrorContext);
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
    const translated = await translateRequest(
      { ...req, aiModel: "greater" },
      user.token ?? ""
    );
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
  return (
    <Container>
      <AddButton handler={() => setOpen((prev) => !prev)} />
      <RegisterModal
        registerWordProfile={registerClient(user.token ?? "")}
        updateWordProfile={updateClient(user.token ?? "")}
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
