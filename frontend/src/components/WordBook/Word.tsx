import React, { FC } from "react";

export type WordProps = {
  word: string;
};
export const Word: FC<WordProps> = (props) => {
  return <div className="text-3xl font-bold underline">{props.word}</div>;
};
