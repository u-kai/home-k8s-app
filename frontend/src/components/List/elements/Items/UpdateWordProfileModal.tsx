import Modal from "@mui/material/Modal";
import { Fab, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { styled } from "styled-components";
import { TextAreaField } from "@aws-amplify/ui-react";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import { WordProfile } from "../../../../contexts/wordbook";
import { AppErrorContext } from "../../../../contexts/error";
import { UserContext } from "../../../../contexts/user";
import { emptySentence, useWordBook } from "../../../../hooks/useWordBooks";
//import { ExampleSentenceField } from "../../../Registers/elements/ExampleSentenceField";
//import {
//  createTranslateRequest,
//  generateSentence,
//  translateRequest,
//} from "../../../../clients/translate";

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

type ModalProps = {
  open: boolean;
  handleClose: () => void;
  oldWordProfile: WordProfile;
};
const PER_PUSH_BUTTON = 105;
const INIT_SAVE_BUTTON_POSITION_BASE = 420;
const initSaveButtonPosition = (wordProfile: WordProfile) => {
  if (wordProfile.sentences.length === 0) {
    return INIT_SAVE_BUTTON_POSITION_BASE;
  }
  return 420 + 105 * (wordProfile.sentences.length - 1);
};

export const UpdateWordProfileModal = (props: ModalProps) => {
  const [wordProfile, setWordProfile] = useState<WordProfile>(
    props.oldWordProfile
  );
  useEffect(() => {
    if (props.oldWordProfile.sentences.length === 0) {
      setWordProfile({
        ...props.oldWordProfile,
        sentences: [emptySentence],
      });
      return;
    }
    setWordProfile(props.oldWordProfile);
    setSaveButtonPosition(initSaveButtonPosition(props.oldWordProfile));
  }, [props.open]);
  const { setAppError } = useContext(AppErrorContext);
  const [aiProgress, setAiProgress] = useState<boolean>(false);
  const { user } = useContext(UserContext);
  const [saveButtonPosition, setSaveButtonPosition] = useState<number>(
    initSaveButtonPosition(wordProfile)
  );

  const { updateWordProfile } = useWordBook();
  const addEmpty = () => {
    setWordProfile({
      ...wordProfile,
      sentences: [...wordProfile.sentences, emptySentence],
    });
  };

  const increaseSaveButtonPosition = (posi: number) => {
    setSaveButtonPosition(saveButtonPosition + posi);
  };
  const decreaseSaveButtonPosition = (posi: number) => {
    setSaveButtonPosition(saveButtonPosition - posi);
  };
  const backToInitPosition = () => {
    setSaveButtonPosition(initSaveButtonPosition(wordProfile));
  };
  const update = async () => {
    await updateWordProfile(wordProfile);
    props.handleClose();
    backToInitPosition();
    return;
  };

  const changeExampleSentence = (index: number, sentence: string) => {
    const newExampleSentences = [...wordProfile.sentences];
    newExampleSentences[index].sentence.value = sentence;
    setWordProfile({ ...wordProfile, sentences: newExampleSentences });
  };

  const changeExampleSentenceMeaning = (index: number, meaning: string) => {
    const newExampleSentencesMeaning = [...wordProfile.sentences];
    newExampleSentencesMeaning[index].sentence.meaning = meaning;
    setWordProfile({ ...wordProfile, sentences: newExampleSentencesMeaning });
  };

  const onDeletePress = (index: number) => {
    if (wordProfile.sentences.length === 1) {
      setWordProfile({ ...wordProfile, sentences: [emptySentence] });
      return;
    }
    const newExampleSentences = [...wordProfile.sentences];
    newExampleSentences.splice(index, 1);
    setWordProfile({ ...wordProfile, sentences: newExampleSentences });
  };

  const translateHandler = async (): Promise<void> => {
    const result = await translateRequest(
      createTranslateRequest(wordProfile.word.value, wordProfile.word.meaning),
      user.token ?? ""
    );

    if (wordProfile.word.value.length === 0) {
      setWordProfile({
        ...wordProfile,
        word: {
          value: result,
          meaning: wordProfile.word.meaning,
          pronunciation: wordProfile.word.pronunciation,
        },
      });
    } else {
      setWordProfile({
        ...wordProfile,
        word: {
          value: wordProfile.word.value,
          meaning: result,
          pronunciation: wordProfile.word.pronunciation,
        },
      });
    }
    setAiProgress(false);
  };
  const generateSentenceHandler = async (index: number): Promise<void> => {
    if (wordProfile.word.value.length === 0) {
      return;
    }
    const result = await generateSentence(
      {
        word: wordProfile.word.value,
        toLang: "en",
      },
      user.token ?? ""
    ).catch((e) => {
      setAppError({
        message: "Failed to create sentence" + e.toString(),
        id: "createSentence",
        name: "createSentence",
      });
    });
    if (!result) return;
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
              value={wordProfile.word.value}
              onChange={(e) =>
                setWordProfile({
                  ...wordProfile,
                  word: { ...wordProfile.word, value: e.target.value },
                })
              }
            />
            <TextField
              sx={textFieldStyle}
              id="standard-required"
              label="カタカナ読み"
              variant="standard"
              value={wordProfile.word.pronunciation}
              onChange={(e) =>
                setWordProfile({
                  ...wordProfile,
                  word: { ...wordProfile.word, pronunciation: e.target.value },
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
                value={wordProfile.word.meaning}
                onChange={(e) =>
                  setWordProfile({
                    ...wordProfile,
                    word: { ...wordProfile.word, meaning: e.target.value },
                  })
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
                    translateHandler();
                    setAiProgress(true);
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
                sentence={value.sentence.value}
                onSentenceChange={(value) =>
                  changeExampleSentence(index, value)
                }
                onDeletePress={() => {
                  onDeletePress(index);
                  if (wordProfile.sentences.length !== 1) {
                    decreaseSaveButtonPosition(PER_PUSH_BUTTON);
                  }
                }}
                onMeaningChange={(value) =>
                  changeExampleSentenceMeaning(index, value)
                }
                meaning={value.sentence.meaning}
                onAssistantPress={async () => generateSentenceHandler(index)}
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
                addEmpty();
                increaseSaveButtonPosition(PER_PUSH_BUTTON);
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
                update();
              }}
            >
              更新する
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
                props.handleClose();
              }}
            >
              キャンセル
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
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
