import React, { useEffect, useRef } from "react";
import { TextAreaField } from "@aws-amplify/ui-react";
import { styled } from "styled-components";
import { InputField } from "./InputField";
import { InputFieldWithButton } from "./InputFieldWithButton";
import { AISupportButton } from "./AISupportButton";
import { TextField } from "@mui/material";

type Word = {
  value: string;
  meaning: string;
  pronunciation?: string;
  remarks: string;
};

export type WordFieldProps = {
  open: boolean;
  word: Word;
  translateHandler: () => Promise<void>;
  handleWordChange: (word: string) => void;
  handleMeaningChange: (meaning: string) => void;
  handlePronunciationChange: (pronunciation: string) => void;
  handleRemarksChange: (remarks: string) => void;
  width?: string;
  errorHandler: (error: Error) => void;
  enterKeyDownHandler?: () => Promise<void>;
  aiProgress: boolean;
  toggleAiProgress: (to: boolean) => void;
};

export const WordField = (props: WordFieldProps) => {
  const translateRequest = async () => {
    props.toggleAiProgress(true);
    await props
      .translateHandler()
      .then((_) => props.toggleAiProgress(false))
      .catch((e) => props.errorHandler(e));
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (props.open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [props.open]);
  return (
    <Container width={props.width}>
      <TextField
        inputRef={inputRef}
        autoFocus={true}
        required
        id="standard-required"
        label="New Word"
        variant="standard"
        value={props.word.value}
        sx={{
          width: props.width,
        }}
        onChange={(e) => props.handleWordChange(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            await props.enterKeyDownHandler?.();
          }
        }}
      />
      <InputField
        width={props.width}
        id="standard-required"
        label="カタカナ読み"
        variant="standard"
        value={props.word.pronunciation ?? ""}
        handleWordChange={props.handlePronunciationChange}
      />
      <InputFieldWithButton
        width={props.width}
        required
        id="standard-required"
        label="Meaning"
        variant="standard"
        value={props.word.meaning}
        handleWordChange={props.handleMeaningChange}
        button={
          <AISupportButton
            handleClick={translateRequest}
            aiProgress={props.aiProgress}
            toggleAiProgress={props.toggleAiProgress}
          />
        }
      />
      <TextAreaField
        style={{
          marginTop: "10px",
          width: props.width,
          height: "70px",
          borderWidth: "1px",
        }}
        id="standard-required"
        label=""
        placeholder="備考"
        value={props.word.remarks}
        onChange={(e) => props.handleRemarksChange(e.target.value)}
      />
    </Container>
  );
};

const Container = styled.div<{ width?: string; height?: string }>`
  position: absolute;
  width: ${(props) => props.width ?? "100%"};
  height: ${(props) => props.height ?? "100%"};
  z-index: -2;
  display: flex;
  flex-direction: column;
`;
