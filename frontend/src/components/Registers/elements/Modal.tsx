import Modal from "@mui/material/Modal";
import { Fab, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { styled } from "styled-components";
import { ExampleSentenceField } from "./ExampleSentenceField";
import { isFailed } from "../../../clients/fetch";
import { UserContext } from "../../../contexts/user";
import { RegisterWordRequest, useWordBook } from "../../../hooks/useWordBooks";
import { TextAreaField } from "@aws-amplify/ui-react";
import { AppErrorContext } from "../../../contexts/error";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { TranslateConfigContext } from "../../../contexts/translateConfig";
import {
  createTranslateRequest,
  generateSentence,
  ToLang,
  translateRequest,
} from "../../../clients/translate";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  height: 500,
  bgcolor: "white",
  border: "2px solid #000",
  overflowY: "scroll",
  paddingX: 4,
  paddingY: 2,
};

export type ModalProps = {
  open: boolean;
  handleClose: () => void;
  registerHandler: (target: RegisteredWordProfile) => Promise<void>;
  translateHandler?: (req: { word: string; toLang: ToLang }) => Promise<string>;
  createSentenceHandler?: (
    word: string
  ) => Promise<{ value: string; meaning: string }>;
  init?: RegisteredWordProfile;
  errorHandler?: (error: Error) => void;
};

export type RegisteredWordProfile = {
  word: string;
  meaning: string;
  pronunciation?: string;
  remarks: string;
  sentences: {
    value: string;
    meaning: string;
    pronunciation?: string;
  }[];
};

const INIT_SAVE_BUTTON_POSITION = 420;
const PER_PUSH_BUTTON = 105;

const INIT_SENTENCE = {
  value: "",
  meaning: "",
};

const INIT_WORD_PROFILE: RegisteredWordProfile = {
  word: "",
  meaning: "",
  pronunciation: "",
  remarks: "",
  sentences: [INIT_SENTENCE],
};

export const WordModal = (props: ModalProps) => {
  const [wordProfile, setWordProfile] = useState<RegisteredWordProfile>(
    props.init ?? INIT_WORD_PROFILE
  );
  const addNewSentence = () => {
    setWordProfile({
      ...wordProfile,
      sentences: [...wordProfile.sentences, INIT_SENTENCE],
    });
  };
  const changeSentence = (index: number, sentence: string) => {
    wordProfile.sentences[index].value = sentence;
    setWordProfile({ ...wordProfile });
  };

  const changeSentenceMeaning = (index: number, meaning: string) => {
    wordProfile.sentences[index].meaning = meaning;
    setWordProfile({ ...wordProfile });
  };

  const [saveButtonPosition, setSaveButtonPosition] = useState<number>(
    INIT_SAVE_BUTTON_POSITION
  );
  const increaseSaveButtonPosition = () => {
    setSaveButtonPosition(saveButtonPosition + PER_PUSH_BUTTON);
  };
  const decreaseSaveButtonPosition = () => {
    setSaveButtonPosition(saveButtonPosition - PER_PUSH_BUTTON);
  };
  const backToInitPosition = () => {
    setSaveButtonPosition(INIT_SAVE_BUTTON_POSITION);
  };

  const [cancel, setCancel] = useState<boolean>(false);
  const [aiProgress, setAiProgress] = useState<boolean>(false);

  //const inputEnterHandler = async (e: React.KeyboardEvent) => {
  //  const minWordLength = 1;
  //  if (wordValue.length <= minWordLength) {
  //    return;
  //  }
  //  if (e.key === "Enter") {
  //    //  console.log("Enter");
  //    //  console.log(translateConfig);
  //    //  if (translateConfig.autoMeaning) {
  //    //    translateHandler().then(() => setAiProgress(false));
  //    //    setAiProgress(true);
  //    //  }
  //    //  if (translateConfig.autoSentence) {
  //    //    const initIndex = 0;
  //    //    createSentenceHandler(initIndex);
  //    //  }
  //  }
  //};

  const register = async () => {
    props
      .registerHandler(wordProfile)
      .then(() => {
        props.handleClose();
        allClear();
        backToInitPosition();
      })
      .catch((e) => {
        props.errorHandler?.(e);
      });
  };

  const onDeleteSentence = (index: number) => {
    if (wordProfile.sentences.length === 1) {
      wordProfile.sentences[0] = {
        value: "",
        meaning: "",
      };
      setWordProfile({ ...wordProfile });
      return;
    }
    setWordProfile((prev) => {
      const sentences = prev.sentences.filter((_, i) => i !== index);
      return { ...prev, sentences };
    });
  };

  const translateRequest = async () => {
    setAiProgress(true);
    if (wordProfile.word.length === 0) {
      const req = {
        word: wordProfile.meaning,
        toLang: "en" as ToLang,
      };
      const translated = await props.translateHandler?.(req).catch((e) => {
        props.errorHandler?.(e);
      });
      setWordProfile({ ...wordProfile, word: translated ?? "" });
      return;
    }

    const req = {
      word: wordProfile.word,
      toLang: "ja" as ToLang,
    };
    const translated = await props.translateHandler?.(req).catch((e) => {
      props.errorHandler?.(e);
    });
    setWordProfile({ ...wordProfile, meaning: translated ?? "" });
  };

  const allClear = () => {
    setWordProfile(INIT_WORD_PROFILE);
  };

  //const translateHandler = async (): Promise<void> => {
  //  const translated = await translateRequest(
  //    createTranslateRequest(wordValue, meaning),
  //    user.token ?? ""
  //  );
  //  if (wordValue.length === 0) {
  //    setWordValue(translated);
  //  } else {
  //    console.log("translated", translated);
  //    setMeaning(translated);
  //  }
  //  setAiProgress(false);
  //};
  //const createSentenceHandler = async (index: number): Promise<void> => {
  //  if (wordValue.length === 0) {
  //    return;
  //  }
  //  const generated = await generateSentence(
  //    {
  //      word: wordValue,
  //      toLang: "en",
  //    },
  //    user.token ?? ""
  //  );
  //  changeExampleSentence(index, generated.sentence);
  //  changeExampleSentenceMeaning(index, generated.meaning);
  //  return;
  //};

  // Modalが開いた時にすぐに入力できるようにするための処理
  const topInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (props.open) {
      setTimeout(() => {
        topInputRef.current?.focus();
      }, 100);
    }
  }, []);

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ height: "100%" }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Register New Word and Sentences
          </Typography>
          <TextFieldContainer>
            <TextField
              autoFocus={true}
              inputRef={topInputRef}
              sx={textFieldStyle}
              required
              id="standard-required"
              label="New Word"
              variant="standard"
              value={wordProfile.word}
              onChange={(e) =>
                setWordProfile({ ...wordProfile, word: e.target.value })
              }
              //onKeyDown={inputEnterHandler}
            />
            <TextField
              sx={textFieldStyle}
              id="standard-required"
              label="カタカナ読み"
              variant="standard"
              value={wordProfile.pronunciation}
              onChange={(e) =>
                setWordProfile({
                  ...wordProfile,
                  pronunciation: e.target.value,
                })
              }
            />
            <MeaningTextAndAiContainer>
              <TextField
                sx={textFieldStyle}
                required
                id="standard-required"
                label="Meaning"
                variant="standard"
                value={wordProfile.meaning}
                onChange={(e) =>
                  setWordProfile({ ...wordProfile, meaning: e.target.value })
                }
              />
              {aiProgress ? (
                <CircularProgress
                  sx={{
                    position: "absolute",
                    top: 20,
                    left: "85%",
                  }}
                />
              ) : (
                <SupportAgentIcon
                  fontSize="large"
                  onClick={async () => {
                    await translateRequest();
                    setAiProgress(false);
                  }}
                  sx={{
                    position: "absolute",
                    top: 20,
                    left: "85%",
                    cursor: "pointer",
                    ":hover": {
                      opacity: 0.5,
                    },
                  }}
                />
              )}
            </MeaningTextAndAiContainer>
            <TextAreaField
              style={{
                ...textFieldStyle,
                height: "70px",
                borderWidth: "1px",
              }}
              id="standard-required"
              label=""
              placeholder="備考"
              value={wordProfile.remarks}
              onChange={(e) =>
                setWordProfile({ ...wordProfile, remarks: e.target.value })
              }
            />
            {wordProfile.sentences.map((value, index) => (
              <ExampleSentenceField
                key={index}
                sentence={value.value}
                onSentenceChange={(value) => changeSentence(index, value)}
                onDeletePress={() => {
                  onDeleteSentence(index);
                  if (wordProfile.sentences.length !== 1) {
                    decreaseSaveButtonPosition();
                  }
                }}
                onMeaningChange={(value) => changeSentenceMeaning(index, value)}
                meaning={value.meaning}
                onAssistantPress={async () => {
                  const sentence = await props
                    .createSentenceHandler?.(wordProfile.word)
                    .catch((e) => {
                      props.errorHandler?.(e);
                    });
                  if (sentence) {
                    changeSentence(index, sentence.value);
                    changeSentenceMeaning(index, sentence.meaning);
                  }
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: "82%",
                top: "70%",
                padding: "10px",
                width: "100px",
              }}
              onClick={() => {
                addNewSentence();
                increaseSaveButtonPosition();
              }}
            >
              <Fab color="primary" aria-label="add" size="small">
                <AddIcon />
              </Fab>
            </div>
          </TextFieldContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "80px",
            }}
          >
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
          </div>
        </Box>
      </Modal>
      {cancel ? (
        <DeleteConfirmModal
          open={cancel}
          setOpen={setCancel}
          deleteHandler={async () => {
            allClear();
            props.handleClose();
            backToInitPosition();
          }}
        />
      ) : null}
    </div>
  );
};

const Container = styled(Box)`
  position: absolute; 
  top: 50%;
  left: 50%;
  transform: translate(-50%; -50%),
  width: 650;
  height: 500;
  background-color: white;
  border: 2px solid #000;
  overflowY: scroll;
  paddingX: 4;
  paddingY: 2;
`;

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
