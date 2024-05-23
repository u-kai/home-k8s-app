import React, { useEffect, useState } from "react";
import { keyframes, styled } from "styled-components";
import { TextArea } from "./components";

const DEFAULT_WIDTH = "200px";
const DEFAULT_HEIGHT = "100px";

export const SpanInput = (props: {
  width?: string;
  height?: string;
  value: string;
  placeholder?: string;
  handleChange: (value: string) => void;
  handleWordClick: (word: string) => Promise<void>;
  handleEnter?: () => void;
}) => {
  // splitは空文字に対しては第一要素が空文字の配列を返すため、配列の長さは常に1以上
  const words = props.value.split(" ");
  const width = props.width || DEFAULT_WIDTH;
  const height = props.height || DEFAULT_HEIGHT;
  const placeholder = props.placeholder || "Type here";
  const [focused, setFocused] = useState(false);
  const [focusedCharIndex, setFocusedCharIndex] = useState(0);

  return (
    <Container width={width} height={height}>
      <TextAreaWrapper
        onClick={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        tabIndex={0}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          props.handleChange(props.value + text);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            setFocusedCharIndex((prev) => prev + 1);
          } else if (e.key === "ArrowLeft") {
            setFocusedCharIndex((prev) => prev - 1);
          } else if (e.key === "Enter") {
            props.handleEnter && props.handleEnter();
          } else if (e.key === "Backspace") {
            // 現在フォーカスしている文字を削除
            //const value =
            //  props.value.slice(0, focusedCharIndex) +
            //  props.value.slice(focusedCharIndex + 1);

            const value = props.value.slice(0, -1);
            props.handleChange(value);
            setFocusedCharIndex((prev) => prev - 1);
          } else if (e.key.length === 1) {
            //const value =
            //  props.value.slice(0, focusedCharIndex) +
            //  e.key +
            //  props.value.slice(focusedCharIndex);
            const value = props.value + e.key;
            props.handleChange(value);
            setFocusedCharIndex((prev) => prev + 1);
          }
        }}
      >
        {
          // {!focused && words[0].length === 0 ? (
          //    <Placeholder>{placeholder}</Placeholder>
          //  ) : null}
          //  {words.map((word, index) => (
          //    <React.Fragment key={"fragment" + index}>
          //      <Word
          //        width={width}
          //        key={index}
          //        onClick={() => props.handleWordClick(word)}
          //        onFocus={() => console.log("focus", word)}
          //        onSelect={() => console.log("select", word)}
          //      >
          //        {word}
          //      </Word>
          //      {focused && index === words.length - 1 && (
          //        <Caret key={"caret" + index} left={-4}></Caret>
          //      )}
          //    </React.Fragment>
          //  ))}
        }
      </TextAreaWrapper>
    </Container>
  );
};

const Container = styled.div<{ width: string; height: string }>`
  position: relative;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  z-index: -2;
`;

const Placeholder = styled.span`
  color: #a9a9a9;
`;

const TextAreaWrapper = styled.div`
  position: absolute;
  z-index: 0;
  left: 0;
  top: 0;
  white-space: pre-wrap;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  border: 1px solid black;
`;

const Word = styled.span<{ width: string }>`
  margin: 1px 4px;
  cursor: pointer;
  display: inline-block;
  /* max-width: ${(props) => props.width};*/
  &:hover {
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
