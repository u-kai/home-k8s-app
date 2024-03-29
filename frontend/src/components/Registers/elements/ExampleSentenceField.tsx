import { TextField } from "@mui/material";
import React, { useState } from "react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { TextFieldContainer, textFieldStyle } from "./Modal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CircularProgress from "@mui/material/CircularProgress";

type ExampleSentenceFieldProps = {
  sentence: string;
  onSentenceChange: (sentence: string) => void;
  meaning: string;
  onMeaningChange: (meaning: string) => void;
  onDeletePress: () => void;
  onAssistantPress: () => Promise<void>;
};

export const ExampleSentenceField = (props: ExampleSentenceFieldProps) => {
  const [aiProgress, setAiProgress] = useState<boolean>(false);
  return (
    <div style={{ position: "relative" }}>
      <TextFieldContainer>
        <TextField
          sx={textFieldStyle}
          id="optional"
          label="Example Sentence"
          variant="standard"
          value={props.sentence}
          onChange={(e) => props.onSentenceChange(e.target.value)}
        />
        <TextField
          sx={textFieldStyle}
          id="standard-required"
          label="Example Sentences Meaning"
          variant="standard"
          value={props.meaning}
          onChange={(e) => props.onMeaningChange(e.target.value)}
        />
        <DeleteForeverIcon
          onClick={props.onDeletePress}
          fontSize="large"
          sx={{
            position: "absolute",
            top: "30%",
            left: "85%",
            cursor: "pointer",
            ":hover": {
              opacity: 0.5,
            },
          }}
        />
        {aiProgress ? (
          <CircularProgress
            sx={{
              position: "absolute",
              top: "80%",
              left: "85%",
            }}
          />
        ) : (
          <SupportAgentIcon
            fontSize="large"
            onClick={async () => {
              setAiProgress(true);
              await props.onAssistantPress();
              setAiProgress(false);
            }}
            sx={{
              position: "absolute",
              top: "80%",
              left: "85%",
              cursor: "pointer",
              ":hover": {
                opacity: 0.5,
              },
            }}
          />
        )}
      </TextFieldContainer>
    </div>
  );
};
