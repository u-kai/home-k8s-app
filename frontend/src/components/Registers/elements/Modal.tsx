import Modal from "@mui/material/Modal";
import { TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { styled } from "styled-components";
import { ExampleSentenceField } from "./ExampleSentenceField";
import {
  authorizationHeader,
  createSentenceUrl,
  fetchJsonWithCors,
  isFailed,
  translateUrl,
} from "../../../fetch";
import { UserContext } from "../../../contexts/user";
import { useWordBook } from "../../../hooks/useWordBooks";
import { Sentence } from "../../../contexts/wordbook";
import { TextAreaField } from "@aws-amplify/ui-react";
import { AppErrorContext } from "../../../contexts/error";
import { fetchAuthSession } from "aws-amplify/auth";

const style = {
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
};

type ModalProps = {
  open: boolean;
  handleClose: () => void;
};

export const RegisterModal = (props: ModalProps) => {
  const { setAppError } = useContext(AppErrorContext);
  const [wordValue, setWordValue] = useState<string>("");
  const [meaning, setMeaning] = useState<string>("");
  const [pronunciation, setPronunciation] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [exampleSentences, setExampleSentences] = useState<string[]>([""]);
  const [exampleSentencesMeaning, setExampleSentencesMeaning] = useState<
    string[]
  >([""]);
  const { user } = useContext(UserContext);
  const INIT_SAVE_BUTTON_POSITION = 400;
  const [saveButtonPosition, setSaveButtonPosition] = useState<number>(
    INIT_SAVE_BUTTON_POSITION
  );
  const { registerWordProfile } = useWordBook();
  const addEmpty = () => {
    setExampleSentences([...exampleSentences, ""]);
    setExampleSentencesMeaning([...exampleSentencesMeaning, ""]);
  };

  const PER_PUSH_BUTTON = 110;
  const increaseSaveButtonPosition = (posi: number) => {
    setSaveButtonPosition(saveButtonPosition + posi);
  };
  const decreaseSaveButtonPosition = (posi: number) => {
    setSaveButtonPosition(saveButtonPosition - posi);
  };
  const backToInitPosition = () => {
    setSaveButtonPosition(INIT_SAVE_BUTTON_POSITION);
  };

  const changeExampleSentence = (index: number, sentence: string) => {
    const newExampleSentences = [...exampleSentences];
    newExampleSentences[index] = sentence;
    setExampleSentences(newExampleSentences);
  };

  const changeExampleSentenceMeaning = (index: number, meaning: string) => {
    const newExampleSentencesMeaning = [...exampleSentencesMeaning];
    newExampleSentencesMeaning[index] = meaning;
    setExampleSentencesMeaning(newExampleSentencesMeaning);
  };

  const onDeletePress = (index: number) => {
    if (exampleSentences.length === 1) {
      setExampleSentences([""]);
      setExampleSentencesMeaning([""]);
      return;
    }
    const newExampleSentences = [...exampleSentences];
    newExampleSentences.splice(index, 1);
    setExampleSentences(newExampleSentences);

    const newExampleSentencesMeaning = [...exampleSentencesMeaning];
    newExampleSentencesMeaning.splice(index, 1);
    setExampleSentencesMeaning(newExampleSentencesMeaning);
  };
  const allClear = () => {
    setWordValue("");
    setMeaning("");
    setPronunciation("");
    setExampleSentences([""]);
    setExampleSentencesMeaning([""]);
  };

  const translateRequest = async (): Promise<void> => {
    let toLang = "日本語";
    let target = wordValue;
    if (target.length === 0) {
      if (meaning.length === 0) {
        return;
      }
      toLang = "英語";
      target = meaning;
    }
    const authHeader = authorizationHeader(user.token ?? "");
    const body = { target, toLang, userId: user.id };
    const res = await fetchJsonWithCors<
      { target: string; toLang: string },
      { results: string[] }
    >({
      url: translateUrl(),
      method: "POST",
      body,
      headers: authHeader,
    });
    if (isFailed(res)) {
      setAppError({
        message: "Failed to translate" + res.message,
        id: "translate",
        name: "translate",
      });
      return;
    }
    const result = res.results;
    if (wordValue.length === 0) {
      setWordValue(result[0]);
    } else {
      setMeaning(result[0]);
    }
  };
  const createSentenceRequest = async (index: number): Promise<void> => {
    if (wordValue.length === 0) {
      return;
    }
    const body = {
      word: wordValue,
      userId: user.id,
    };
    const authHeader = authorizationHeader(user.token ?? "");
    const res = await fetchJsonWithCors<
      { word: string },
      { sentence: string; meaning: string }
    >({
      url: createSentenceUrl(),
      method: "POST",
      body,
      headers: authHeader,
    });
    if (isFailed(res)) {
      setAppError({
        message: "Failed to create sentence" + res.message,
        id: "createSentence",
        name: "createSentence",
      });
      return;
    }
    const result = res;
    changeExampleSentence(index, result.sentence);
    changeExampleSentenceMeaning(index, result.meaning);
    return;
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
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Register New Word and Sentences
          </Typography>
          <TextFieldContainer>
            <TextField
              sx={textFieldStyle}
              required
              id="standard-required"
              label="New Word"
              variant="standard"
              value={wordValue}
              onChange={(e) => setWordValue(e.target.value)}
            />
            <TextField
              sx={textFieldStyle}
              id="standard-required"
              label="カタカナ読み"
              variant="standard"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
            />
            <MeaningTextAndAiContainer>
              <TextField
                sx={textFieldStyle}
                required
                id="standard-required"
                label="Meaning"
                variant="standard"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
              />
              <SupportAgentIcon
                fontSize="large"
                onClick={async () => {
                  translateRequest();
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
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            {exampleSentences.map((value, index) => (
              <ExampleSentenceField
                key={index}
                sentence={value}
                onSentenceChange={(value) =>
                  changeExampleSentence(index, value)
                }
                onDeletePress={() => {
                  onDeletePress(index);
                  if (exampleSentences.length !== 1) {
                    decreaseSaveButtonPosition(PER_PUSH_BUTTON);
                  }
                }}
                onMeaningChange={(value) =>
                  changeExampleSentenceMeaning(index, value)
                }
                meaning={exampleSentencesMeaning[index]}
                onAssistantPress={async () => createSentenceRequest(index)}
              />
            ))}
            <Button
              variant="contained"
              size="medium"
              color="primary"
              sx={{
                position: "absolute",
                left: "82%",
                top: "70%",
                padding: "10px",
                width: "100px",
              }}
              onClick={() => {
                addEmpty();
                increaseSaveButtonPosition(PER_PUSH_BUTTON);
              }}
            >
              例文を追加
            </Button>
          </TextFieldContainer>
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
              const sentences: Sentence[] = exampleSentences
                .map((value, index) => {
                  return {
                    value: value,
                    meaning: exampleSentencesMeaning[index],
                    pronunciation: "",
                  };
                })
                .filter((value) => value.value.length > 0);

              const result = await registerWordProfile({
                word: wordValue,
                meaning: meaning,
                pronunciation: pronunciation,
                remarks: remarks,
                sentences,
              });
              if (isFailed(result)) {
                setAppError({
                  name: "単語の登録に失敗しました。",
                  message: "もう一度お試しください。" + result.message,
                  id: "registerWordProfile",
                });
              }
              props.handleClose();
              allClear();
              backToInitPosition();
              return;
            }}
          >
            保存する
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export const textFieldStyle = {
  width: "80%",
  marginTop: "5px",
};

const MeaningTextAndAiContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;
export const TextFieldContainer = styled.div`
  width: 90%;
  margin-top: 5px;
  justify-content: center;
  flex-direction: column;
`;
