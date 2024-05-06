import { TextField } from "@mui/material";
import React, { useState, useRef } from "react";
import { keyframes, styled } from "styled-components";

export const SpanInput = (props: {
  handleWordClick: (word: string) => Promise<void>;
  width?: string;
  height?: string;
}) => {
  const [inputText, setInputText] = useState("");
  const words = inputText.split(" ");
  return (
    <Container>
      <TextArea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <TextAreaWrapper>
        {words.length === 0 && <Caret left={0}></Caret>}
        {words.map((word, index) => (
          <>
            <Word key={index} onClick={() => props.handleWordClick(word)}>
              {word}
            </Word>
            {index === words.length - 1 && <Caret left={-4}></Caret>}
          </>
        ))}
      </TextAreaWrapper>
    </Container>
  );
};

const Word = styled.span`
  margin: 0 4px;
  cursor: pointer;
  display: inline-block;
`;

const TextAreaWrapper = styled.div`
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  white-space: pre-wrap;
  overflow: hidden;
`;
const Container = styled.div`
  position: absolute;
  min-width: 300px;
  height: 200px;
  z-index: -2;
  background-color: "transparent";
`;

const TextArea = styled.textarea`
  position: absolute;
  border: 1px solid black;
  z-index: 1;
  height: 200px;
  width: 100%;
  color: transparent;
  resize: none;
`;

const blink = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
`;

const Caret = styled.span<{ left: number }>`
  background-color: black;
  height: 1em;
  width: 1px;
  display: inline-block;
  position: relative;
  top: 2px;
  left: ${(props) => props.left}px;
  animation: ${blink} 0.8s infinite;
`;
