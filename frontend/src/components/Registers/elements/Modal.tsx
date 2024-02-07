import { Modal } from "@mui/base";
import { Fab, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { styled } from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import { ExampleSentenceField } from "./ExampleSentenceField";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "white",
  //border: "2px solid #000",
  boxShadow: 24,
  height: 390,
  overflowY: "scroll",
  p: 4,
};

type ModalProps = {
  open: boolean;
  handleClose: () => void;
};

type Payload = {
  word: string;
  meaning: string;
  pronunciation: string;
  examples: { sentence: string; meaning: string }[];
  timestamp: number;
};

export const RegisterModal = (props: ModalProps) => {
  const [word, setWord] = useState<string>("");
  const [meaning, setMeaning] = useState<string>("");
  const [pronunciation, setPronunciation] = useState<string>("");
  const [exampleSentences, setExampleSentences] = useState<string[]>([""]);
  const [exampleSentencesMeaning, setExampleSentencesMeaning] = useState<
    string[]
  >([""]);
  const [saveButtonPosition, setSaveButtonPosition] = useState<number>(380);
  const addEmpty = () => {
    setExampleSentences([...exampleSentences, ""]);
  };

  const PER_PUSH_BUTTON = 110;
  const increaseSaveButtonPosition = (posi: number) => {
    setSaveButtonPosition(saveButtonPosition + posi);
  };
  const decreaseSaveButtonPosition = (posi: number) => {
    setSaveButtonPosition(saveButtonPosition - posi);
  };

  const changeExampleSentence = (index: number, sentence: string) => {
    const newExampleSentences = [...exampleSentences];
    newExampleSentences[index] = sentence;
    setExampleSentences(newExampleSentences);
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

  const save = () => {
    const payload: Payload = {
      word: word,
      meaning: meaning,
      pronunciation: pronunciation,
      examples: exampleSentences.map((sentence, index) => {
        return { sentence: sentence, meaning: exampleSentencesMeaning[index] };
      }),
      timestamp: Date.now(),
    };
    alert(JSON.stringify(payload));
  };
  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
              value={word}
              onChange={(e) => setWord(e.target.value)}
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
            {exampleSentences.map((value, index) => (
              <ExampleSentenceField
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
                onMeaningChange={() => {}}
                meaning={""}
              />
            ))}
            <Button
              variant="contained"
              size="medium"
              color="primary"
              sx={{
                position: "absolute",
                left: "82%",
                top: "65%",
                marginn: "5px",
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
            sx={{ position: "absolute", left: "82%", top: saveButtonPosition }}
            onClick={save}
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
