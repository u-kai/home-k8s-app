import React from "react";
import { WordAndSentences } from "./WordAndSentences";

export type ItemProps = {
  word: string;
  pronunciation?: string;
  sentences: string[];
};
export const Item = (props: ItemProps) => {
  return (
    <div>
      <WordAndSentences
        word={props.word}
        pronunciation={props.pronunciation}
        sentences={props.sentences}
      />
    </div>
  );
};
