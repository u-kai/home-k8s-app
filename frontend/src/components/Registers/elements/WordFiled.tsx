import React from "react";
import { TextAreaField } from "@aws-amplify/ui-react";
import { styled } from "styled-components";
import { InputField } from "./InputField";
import { InputFieldWithButton } from "./InputFieldWithButton";
import { AISupportButton } from "./AISupportButton";

type Word = {
  value: string;
  meaning: string;
  pronunciation?: string;
  remarks: string;
};

export type WordFieldProps = {
  word: Word;
  translateHandler: () => Promise<void>;
  handleWordChange: (word: string) => void;
  handleMeaningChange: (meaning: string) => void;
  handlePronunciationChange: (pronunciation: string) => void;
  handleRemarksChange: (remarks: string) => void;
  width?: string;
  errorHandler: (error: Error) => void;
};

export const WordField = (props: WordFieldProps) => {
  const translateRequest = async () => {
    await props.translateHandler().catch((e) => props.errorHandler(e));
  };
  return (
    <Container width={props.width}>
      <InputField
        autoFocus={true}
        width={props.width}
        required
        id="standard-required"
        label="New Word"
        variant="standard"
        value={props.word.value}
        handleWordChange={props.handleWordChange}
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
        button={<AISupportButton handleClick={translateRequest} />}
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
