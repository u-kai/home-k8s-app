import React, { useState } from "react";
import { keyframes, styled } from "styled-components";

const DEFAULT_WIDTH = "200px";
const DEFAULT_HEIGHT = "100px";

export const SpanInput = (props: {
  handleWordClick: (word: string) => Promise<void>;
  width?: string;
  height?: string;
  value: string;
  handleChange: (value: string) => void;
}) => {
  const words = props.value.split(" ");
  return (
    <Container
      width={props.width || DEFAULT_WIDTH}
      height={props.height || DEFAULT_HEIGHT}
    >
      <TextArea
        value={props.value}
        onChange={(e) => props.handleChange(e.target.value)}
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

const Container = styled.div<{ width: string; height: string }>`
  position: absolute;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  z-index: -2;
`;

const TextArea = styled.textarea`
  position: absolute;
  border: 1px solid black;
  z-index: 1;
  color: transparent;
  resize: none;
  height: 100%;
  width: 100%;
`;

const TextAreaWrapper = styled.div`
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  white-space: pre-wrap;
  max-width: 100%;
  overflow: hidden;
`;

const Word = styled.span`
  margin: 1px 4px;
  cursor: pointer;
  display: inline-block;
  &:hover {
    height: 90%;
    background-color: #ead9ff;
    text-decoration: underline;
  }
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
