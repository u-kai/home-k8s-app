import React, { useState } from "react";
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
}) => {
  const words = props.value.split(" ");
  const placeholder = props.placeholder || "Type here";
  const [focused, setFocused] = useState(false);
  return (
    <Container
      width={props.width || DEFAULT_WIDTH}
      height={props.height || DEFAULT_HEIGHT}
    >
      <TextArea
        value={props.value}
        onChange={(e) => props.handleChange(e.target.value)}
        placeholder={focused ? "" : placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        color="transparent"
      />
      <TextAreaWrapper>
        {focused && words.length === 0 && <Caret left={0}></Caret>}
        {words.map((word, index) => (
          <React.Fragment key={"fragment" + index}>
            <Word key={index} onClick={() => props.handleWordClick(word)}>
              {word}
            </Word>
            {focused && index === words.length - 1 && (
              <Caret key={"caret" + index} left={-4}></Caret>
            )}
          </React.Fragment>
        ))}
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

//const TextArea = styled.textarea`
//  position: absolute;
//  border: 1px solid #ccc; /* より薄いグレーの枠線 */
//  border-radius: 8px; /* 角の丸みを加える */
//  z-index: 1;
//  color: transparent; /* 色は透明のまま */
//  background-color: rgba(255, 255, 255, 0.5); /* より薄い半透明の背景色 */
//  resize: none; /* リサイズ不可 */
//  height: 100%;
//  width: 100%;
//  padding: 10px; /* 内部の余白 */
//  outline: none; /* アウトラインを削除 */
//  &:hover,
//  &:focus {
//    border-color: #888; /* ホバーまたはフォーカス時の枠線の色を濃いめのグレーに */
//    background-color: rgba(
//      255,
//      255,
//      255,
//      0.7
//    ); /* ホバーまたはフォーカス時の背景色を少し濃く */
//  }
//`;

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
