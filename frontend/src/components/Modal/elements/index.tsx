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

const INIT_SAVE_BUTTON_POSITION = 400;
const PER_PUSH_BUTTON = 105;
const INPUT_WIDTH = "400px";

export const RegisterModal = (props: ModalProps) => {
  const { modalWord, modalWordDispatch } = useContext(ModalContext);
  const { registerWordProfile, updateWordProfile } = useWordBook();
  const [saveButtonPosition, setSaveButtonPosition] = useState<number>(
    INIT_SAVE_BUTTON_POSITION +
      (modalWord.word.sentences.length - 1) * PER_PUSH_BUTTON
  );
  useEffect(() => {
    setSaveButtonPosition(
      INIT_SAVE_BUTTON_POSITION +
        (modalWord.word.sentences.length - 1) * PER_PUSH_BUTTON
    );
  }, [modalWord.open, modalWord.word.sentences.length]);

  const increaseSaveButtonPosition = () => {
    setSaveButtonPosition(saveButtonPosition + PER_PUSH_BUTTON);
  };
  const decreaseSaveButtonPosition = () => {
    setSaveButtonPosition(saveButtonPosition - PER_PUSH_BUTTON);
  };
  const backToInitPosition = () => {
    setSaveButtonPosition(INIT_SAVE_BUTTON_POSITION);
  };

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
          backToInitPosition();
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
        backToInitPosition();
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
          backToInitPosition();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ height: "100%" }}
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 650,
            height: 470,
            bgcolor: "white",
            border: "2px solid #000",
            overflowY: "scroll",
            paddingX: 4,
            paddingY: 2,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Register New Word and Sentences
          </Typography>
          <WordField
            open={modalWord.open}
            word={{
              value: modalWord.word.word.value,
              meaning: modalWord.word.word.meaning,
              remarks: modalWord.word.remarks,
              pronunciation: modalWord.word.word.pronunciation,
            }}
            width={INPUT_WIDTH}
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
                setGenerateSentenceAiProgresses((prev) => prev.map(() => false))
              );
            }}
            errorHandler={props.errorHandler ?? console.error}
            aiProgress={wordTranslateAiProgress}
            toggleAiProgress={(to) => setWordTranslateAiProgress(to)}
          />
          <div
            style={{
              position: "relative",
              top: "240px",
            }}
          >
            {modalWord.word.sentences.map((sentence, index) => (
              <ExampleSentenceField
                key={index}
                width={INPUT_WIDTH}
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
                  if (modalWord.word.sentences.length !== 1) {
                    decreaseSaveButtonPosition();
                  }
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
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: "82%",
              top: "70%",
              padding: "10px",
              width: "100px",
            }}
            onClick={() => {
              modalWordDispatch({
                type: "addNewSentence",
              });
              increaseSaveButtonPosition();
            }}
          >
            <Fab color="primary" aria-label="add" size="small">
              <AddIcon />
            </Fab>
          </div>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            sx={{
              position: "absolute",
              left: "82%",
              top: saveButtonPosition,
              paddingX: "3px",
              paddingY: "10px",
              width: "100px",
            }}
            onClick={async () => {
              register();
            }}
          >
            保存する
          </Button>
          <Button
            color="error"
            variant="contained"
            sx={{
              position: "absolute",
              left: "10",
              top: saveButtonPosition,
              paddingX: "3px",
              paddingY: "10px",
              width: "100px",
            }}
            onClick={async () => {
              setCancel(true);
            }}
          >
            キャンセル
          </Button>
        </Box>
      </Modal>
      {cancel ? (
        <DeleteConfirmModal
          open={cancel}
          setOpen={setCancel}
          deleteHandler={async () => {
            modalWordDispatch({
              type: "close",
            });
            backToInitPosition();
          }}
        />
      ) : null}
    </div>
  );
};
