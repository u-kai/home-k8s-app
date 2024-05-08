import React, { useState } from "react";
import styled from "styled-components";
import { SpanInput } from "./SpanInput";
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
  const isKeyDownEnter = (keyData: string) => {
    return keyData.slice(-1) === "\n";
  };
  return (
    <HorizontalContainer>
      <SpanInput
        value={sentence}
        handleChange={async (event) => {
          // ここでenterが押された時の処理を行う
          if (isKeyDownEnter(event)) {
            // 毎回新しい結果を表示するために初期化
            setResult("");
            await props.sseTranslateSentence(sentence, (chunk) => {
              setResult((prev) => prev + chunk);
            });
            return;
          }
          setSentence(event);
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
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 0;
`;
