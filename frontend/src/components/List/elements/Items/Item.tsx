import React from "react";
import { WordLine } from "./WordLine";

export type ItemProps = {
  word: string;
  pronunciation?: string;
};
export const Item = (props: ItemProps) => {
  return (
    <div>
      <WordLine word={props.word} pronunciation={props.pronunciation} />
    </div>
  );
};
