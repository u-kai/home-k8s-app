import React from "react";
import { styled } from "styled-components";
import { TextArea } from "./components";

export type ReadOnlyInputProps = {
  value: string;
  width: string;
  height: string;
};

export const ReadOnlyInput = (props: ReadOnlyInputProps) => {
  return (
    <TextAreaContainer width={props.width} height={props.height}>
      <TextArea
        value={props.value}
        placeholder="Translate Result"
        color="black"
        readOnly
      />
    </TextAreaContainer>
  );
};

const TextAreaContainer = styled.div<{ width: string; height: string }>`
  position: relative;
  margin-left: 10px;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
