import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { styled } from "styled-components";
import { InputFieldWithButton } from "./InputFieldWithButton";
import { AISupportButton } from "./AISupportButton";

export type ExampleSentenceFieldProps = {
  sentence: string;
  onSentenceChange: (sentence: string) => void;
  meaning: string;
  onMeaningChange: (meaning: string) => void;
  onDeletePress: () => void;
  onAssistantPress: () => Promise<void>;
  width?: string;
  aiProgress: boolean;
  toggleAiProgress: (to: boolean) => void;
};

export const ExampleSentenceField = (props: ExampleSentenceFieldProps) => {
  return (
    <Container>
      <InputFieldWithButton
        id="optional"
        label="Example Sentence"
        variant="standard"
        value={props.sentence}
        handleWordChange={props.onSentenceChange}
        width={props.width}
        button={
          <DeleteForeverIcon
            onClick={props.onDeletePress}
            fontSize="large"
            sx={{
              cursor: "pointer",
              ":hover": {
                opacity: 0.5,
              },
            }}
          />
        }
      />
      <InputFieldWithButton
        width={props.width}
        id="standard-required"
        label="Example Sentences Meaning"
        variant="standard"
        value={props.meaning}
        handleWordChange={props.onMeaningChange}
        button={
          <AISupportButton
            handleClick={props.onAssistantPress}
            aiProgress={props.aiProgress}
            toggleAiProgress={props.toggleAiProgress}
          />
        }
      />
    </Container>
  );
};

const Container = styled.div<{ width?: string; height?: string }>`
  position: relative;
  width: ${(props) => props.width ?? "100%"};
  height: ${(props) => props.height ?? "100%"};
  display: flex;
  flex-direction: column;
`;
