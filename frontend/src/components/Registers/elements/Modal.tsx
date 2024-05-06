import Modal from "@mui/material/Modal";
import { Fab, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { ExampleSentenceField } from "./ExampleSentenceField";
import AddIcon from "@mui/icons-material/Add";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ToLang } from "../../../clients/translate";
import { WordField } from "./WordFiled";

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
const INPUT_WIDTH = "400px";

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

  const allClear = () => {
    setWordProfile(INIT_WORD_PROFILE);
  };

  const translateHandler = async () => {
    const req = createTranslateRequest(wordProfile.word, wordProfile.meaning);
    const translated = await props.translateHandler?.(req).catch((e) => {
      props.errorHandler?.(e);
    });
    if (!translated) return;
    if (wordProfile.word === "") {
      setWordProfile({ ...wordProfile, word: translated });
      return;
    }
    setWordProfile({ ...wordProfile, meaning: translated });
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
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
            word={{
              value: wordProfile.word,
              meaning: wordProfile.meaning,
              remarks: wordProfile.remarks,
              pronunciation: wordProfile.pronunciation,
            }}
            width={INPUT_WIDTH}
            handleWordChange={(value) => {
              setWordProfile({ ...wordProfile, word: value });
            }}
            handleMeaningChange={(value) => {
              setWordProfile({ ...wordProfile, meaning: value });
            }}
            handlePronunciationChange={(value) => {
              setWordProfile({ ...wordProfile, pronunciation: value });
            }}
            handleRemarksChange={(value) => {
              setWordProfile({ ...wordProfile, remarks: value });
            }}
            translateHandler={translateHandler}
            errorHandler={props.errorHandler ?? console.error}
          />
          <div
            style={{
              position: "relative",
              top: "230px",
            }}
          >
            {wordProfile.sentences.map((value, index) => (
              <ExampleSentenceField
                key={index}
                width={INPUT_WIDTH}
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
              addNewSentence();
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
            allClear();
            props.handleClose();
            backToInitPosition();
          }}
        />
      ) : null}
    </div>
  );
};
