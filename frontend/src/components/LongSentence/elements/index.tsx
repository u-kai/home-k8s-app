import React, { useState } from "react";
import styled from "styled-components";
import { LongSentenceArea } from "./LongSentenceArea";
import { ReadOnlyInput } from "./ReadOnlyInput";

export type LongSentenceTranslateProps = {
  handleWordClick: (word: string) => Promise<void>;
  sseTranslateSentence: (
    sentence: string,
    setFn: (chunk: string) => void
  ) => Promise<void>;
  height?: string;
};

export const LongSentenceTranslate = (props: LongSentenceTranslateProps) => {
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState("");
  const WIDTH = "calc(50%)";
  const height = props.height || "200px";
  return (
    <HorizontalContainer>
      <LongSentenceArea
        value={sentence}
        handleChange={async (event) => {
          setSentence(event);
        }}
        handleEnter={async () => {
          // 毎回新しい結果を表示するために初期化
          setResult("");
          await props
            .sseTranslateSentence(sentence, (chunk) => {
              setResult((prev) => prev + chunk);
            })
            .catch((e) => {
              console.error(e);
            });
        }}
        handleWordClick={async (word) => {
          props.handleWordClick(word);
        }}
        placeholder="Input English sentence and Key Down Enter"
        width={WIDTH}
        height={height}
      />
      <ReadOnlyInput value={result} width={WIDTH} height={height} />
    </HorizontalContainer>
  );
};

const HorizontalContainer = styled.div`
  position: relative;
  z-index: -2;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;
