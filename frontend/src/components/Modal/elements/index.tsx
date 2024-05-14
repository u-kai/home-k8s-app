import Modal from "@mui/material/Modal";
import { Fab, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { ExampleSentenceField } from "./ExampleSentenceField";
import AddIcon from "@mui/icons-material/Add";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ToLang } from "../../../clients/translate";
import { WordField } from "./WordFiled";
import { ModalContext, isWordProfile } from "../../../contexts/modalWord";
import {
  RegisterWordProfile,
  UpdateWordProfile,
  useWordBook,
} from "../../../hooks/useWordBooks";
import { styled } from "styled-components";
import { SendButton } from "../../Button/SendButton";
import { CancelButton } from "../../Button/CancelButton";

export type ModalProps = {
  translateHandler?: (req: { word: string; toLang: ToLang }) => Promise<string>;
  createSentenceHandler?: (
    word: string
  ) => Promise<{ value: string; meaning: string }>;
  registerWordProfile: RegisterWordProfile;
  updateWordProfile: UpdateWordProfile;
  errorHandler?: (error: Error) => void;
};

const createTranslateRequest = (
  word: string,
  meaning: string
): { word: string; toLang: ToLang } => {
  if (word.length === 0 && meaning.length !== 0) {
    return {
      toLang: "en",
      word: meaning,
    };
  }
  return {
    toLang: "ja",
    word,
  };
};

export const RegisterModal = (props: ModalProps) => {
  const { modalWord, modalWordDispatch } = useContext(ModalContext);
  const { registerWordProfile, updateWordProfile } = useWordBook();

  const [wordTranslateAiProgress, setWordTranslateAiProgress] =
    useState<boolean>(false);
  const [generateSentenceAiProgresses, setGenerateSentenceAiProgresses] =
    useState<boolean[]>(modalWord.word.sentences.map(() => false));

  const [cancel, setCancel] = useState<boolean>(false);

  const register = async () => {
    const word = modalWord.word;

    // existing word
    if (isWordProfile(word)) {
      updateWordProfile(props.updateWordProfile, word)
        .then(() => {
          modalWordDispatch({
            type: "close",
          });
        })
        .catch((e) => {
          props.errorHandler?.(e);
        });
      return;
    }
    registerWordProfile(props.registerWordProfile, {
      word: word.word.value,
      meaning: word.word.meaning,
      pronunciation: word.word.pronunciation,
      remarks: word.remarks,
      sentences: word.sentences,
    })
      .then(() => {
        modalWordDispatch({
          type: "close",
        });
      })
      .catch((e) => {
        props.errorHandler?.(e);
      });
  };

  const translateHandler = async () => {
    const wordValue = modalWord.word.word.value;
    const meaningValue = modalWord.word.word.meaning;
    const req = createTranslateRequest(wordValue, meaningValue);
    const translated = await props.translateHandler?.(req).catch((e) => {
      props.errorHandler?.(e);
    });
    if (!translated) return;
    if (wordValue === "") {
      modalWordDispatch({
        type: "setWordValue",
        payload: {
          ...modalWord.word,
          setWordValue: translated,
        },
      });
      return;
    }
    modalWordDispatch({
      type: "setWordMeaning",
      payload: {
        ...modalWord.word,
        setWordMeaning: translated,
      },
    });
  };

  const generateSentence = async (index: number) => {
    const sentence = await props
      .createSentenceHandler?.(modalWord.word.word.value)
      .catch((e) => {
        props.errorHandler?.(e);
      });
    if (sentence) {
      modalWordDispatch({
        type: "setSentenceValue",
        payload: {
          setSentenceValue: {
            index,
            value: sentence.value,
            meaning: sentence.meaning,
          },
        },
      });
    }
  };
  return (
    <div>
      <Modal
        open={modalWord.open}
        onClose={() => {
          modalWordDispatch({
            type: "close",
          });
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ height: "100%", width: "100%" }}
      >
        <ModalBox>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ margin: 2 }}
          >
            Register New Word
          </Typography>
          <WordFieldContainer>
            <WordField
              open={modalWord.open}
              word={{
                value: modalWord.word.word.value,
                meaning: modalWord.word.word.meaning,
                remarks: modalWord.word.remarks,
                pronunciation: modalWord.word.word.pronunciation,
              }}
              handleWordChange={(value) => {
                modalWordDispatch({
                  type: "setWordValue",
                  payload: {
                    setWordValue: value,
                  },
                });
              }}
              handleMeaningChange={(value) => {
                modalWordDispatch({
                  type: "setWordMeaning",
                  payload: {
                    setWordMeaning: value,
                  },
                });
              }}
              handlePronunciationChange={(_value) => {
                console.log("TODO:pronunciation change");
              }}
              handleRemarksChange={(value) => {
                console.log("TODO:remarks change");
              }}
              translateHandler={translateHandler}
              enterKeyDownHandler={async () => {
                setWordTranslateAiProgress(true);
                setGenerateSentenceAiProgresses((prev) => prev.map(() => true));

                translateHandler().then((_) =>
                  setWordTranslateAiProgress((prev) => !prev)
                );

                generateSentence(0).then((_) =>
                  setGenerateSentenceAiProgresses((prev) =>
                    prev.map(() => false)
                  )
                );
              }}
              errorHandler={props.errorHandler ?? console.error}
              aiProgress={wordTranslateAiProgress}
              toggleAiProgress={(to) => setWordTranslateAiProgress(to)}
            />
          </WordFieldContainer>
          <AddButtonContainer
            onClick={() => {
              modalWordDispatch({
                type: "addNewSentence",
              });
            }}
          >
            <Fab color="primary" aria-label="add" size="small">
              <AddIcon />
            </Fab>
          </AddButtonContainer>
          <ExampleSentencesFieldContainer>
            {modalWord.word.sentences.map((sentence, index) => (
              <ExampleSentenceFieldContainer>
                <ExampleSentenceField
                  key={index}
                  sentence={
                    "sentence" in sentence
                      ? sentence.sentence.value
                      : sentence.value
                  }
                  onSentenceChange={(value) =>
                    modalWordDispatch({
                      type: "setSentenceValue",
                      payload: {
                        setSentenceValue: {
                          index,
                          value,
                        },
                      },
                    })
                  }
                  onDeletePress={() => {
                    modalWordDispatch({
                      type: "deleteSentence",
                      payload: {
                        deleteSentence: {
                          index,
                        },
                      },
                    });
                  }}
                  onMeaningChange={(value) =>
                    modalWordDispatch({
                      type: "setSentenceValue",
                      payload: {
                        setSentenceValue: {
                          index,
                          meaning: value,
                        },
                      },
                    })
                  }
                  meaning={
                    "meaning" in sentence
                      ? sentence.meaning
                      : sentence.sentence.meaning
                  }
                  onAssistantPress={async () => generateSentence(index)}
                  aiProgress={generateSentenceAiProgresses[index]}
                  toggleAiProgress={(to) => {
                    const progresses = generateSentenceAiProgresses.slice();
                    progresses[index] = to;
                    setGenerateSentenceAiProgresses(progresses);
                  }}
                />
              </ExampleSentenceFieldContainer>
            ))}
          </ExampleSentencesFieldContainer>
          <ButtonContainer>
            <CancelButton
              handleClick={async () => {
                setCancel(true);
              }}
              text="キャンセル"
            />
            <SendButton
              handleClick={async () => {
                register();
              }}
              text="保存する"
            />
          </ButtonContainer>
        </ModalBox>
      </Modal>
      {cancel ? (
        <DeleteConfirmModal
          open={cancel}
          setOpen={setCancel}
          deleteHandler={async () => {
            modalWordDispatch({
              type: "close",
            });
          }}
        />
      ) : null}
    </div>
  );
};

const ModalBox = styled(Box)`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 550px;
  background-color: white;
  border: 2px solid #000;
  overflow: scroll;
  @media (max-width: 430px) and (max-height: 932px) {
    width: 85%;
  }
`;

const WordFieldContainer = styled.div`
  position: relative;
  z-index: -1;
  width: 80%;
  height: 30%;
  margin: 0 auto;
  @media (max-width: 376px) and (max-height: 692px) {
    height: 27%;
    width: 70%;
  }
`;

const AddButtonContainer = styled.div`
  position: relative;
  top: 110px;
  left: 90%;
  @media (max-height: 844px) {
    top: 100px;
    left: 85%;
  }
`;

const ExampleSentencesFieldContainer = styled.div`
  position: relative;
  z-index: -1;
  width: 80%;
  margin: 0 auto;
  top: 110px;
  @media (max-width: 376px) and (max-height: 692px) {
    width: 70%;
  }
`;
const ExampleSentenceFieldContainer = styled.div`
  margin-bottom: 10px;
`;
const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  height: 40px;
  top: 120px;
  margin: 0 auto;
`;
