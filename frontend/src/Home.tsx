import React, { useContext, useEffect } from "react";
import {
  translateRequest,
  generateSentence,
  translateSentence,
  ToLang,
} from "./clients/translate";
import { AppFooter } from "./components/Footer/elements/Footer";
import { Header } from "./components/Header";
import { LongSentenceTranslate } from "./components/LongSentence/elements";
import { RegisterModal } from "./components/Modal/elements";
import { WordBook } from "./components/WordBook";
import { ModalContext } from "./contexts/modalWord";
import { UserContext } from "./contexts/user";
import { Frame } from "./Frame";
import {
  deleteWordProfile,
  registerWordProfile,
  updateWordProfile,
  useWordBook,
  fetchAllWordProfiles,
} from "./hooks/useWordBooks";

export const Home = () => {
  const [meaningBuffer, setMeaningBuffer] = React.useState("");
  const [sentenceBuffer, setSentenceBuffer] = React.useState("");
  const { modalWordDispatch } = useContext(ModalContext);
  const { fetchAll } = useWordBook();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchAll(fetchAllWordProfiles(user.token ?? ""));
  }, [user.token]);

  return (
    <>
      <Frame
        header={<Header logout={async () => console.log("logout")} />}
        wordbook={
          <WordBook
            playAudio={async () => console.log("play")}
            updateWordProfile={updateWordProfile(user.token ?? "")}
            deleteWordProfile={deleteWordProfile(user.token ?? "")}
          />
        }
        translateSentence={
          <LongSentenceTranslate
            sseTranslateSentence={async (
              sentence: string,
              setFn: (chunk: string) => void
            ) => {
              translateSentence(
                {
                  sentence,
                  sseHandler: async (data: string) => {
                    setFn(data);
                    setSentenceBuffer(sentence);
                    setMeaningBuffer((prev) => prev + data);
                  },
                  toLang: "ja",
                },
                user.token ?? ""
              );
            }}
            handleWordClick={async (word: string) => {
              modalWordDispatch({
                type: "openWith",
                payload: {
                  openWith: {
                    word: {
                      value: word,
                      meaning: "",
                      pronunciation: "",
                    },
                    sentences: [
                      {
                        value: sentenceBuffer,
                        meaning: meaningBuffer,
                        pronunciation: "",
                      },
                    ],
                    remarks: "",
                  },
                },
              });
            }}
            height="100%"
          />
        }
        footer={<AppFooter />}
      />
      <RegisterModal
        translateHandler={async (req: { word: string; toLang: ToLang }) => {
          const response = await translateRequest(req, user.token ?? "");
          return response;
        }}
        createSentenceHandler={async (word: string) => {
          const req: {
            word: string;
            toLang: ToLang;
          } = {
            word,
            toLang: "en",
          };
          const response = await generateSentence(req, user.token ?? "");
          return {
            value: response.sentence,
            meaning: response.meaning,
          };
        }}
        errorHandler={(error: Error) => console.log(error)}
        registerWordProfile={registerWordProfile(user.token ?? "")}
        updateWordProfile={updateWordProfile(user.token ?? "")}
      />
    </>
  );
};
