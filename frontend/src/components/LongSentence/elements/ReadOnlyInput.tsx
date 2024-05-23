import React from "react";
import { styled } from "styled-components";
import { TextField } from "@mui/material";

export type ReadOnlyInputProps = {
  value: string;
  width: string;
  height: string;
};

export const ReadOnlyInput = (props: ReadOnlyInputProps) => {
  return (
    <TextAreaContainer width={props.width} height={props.height}>
      <TextField
        value={props.value}
        placeholder="Translate Result"
        rows={5}
        sx={{ width: "100%", height: "100%" }}
        multiline
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
