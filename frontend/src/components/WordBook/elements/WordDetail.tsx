import React from "react";
import { Sentence } from "./Sentence";

export type WordDetailProps = {
  wordMeaning: string;
  sentences: {
    sentence: string;
    meaning: string;
  }[];
  playAudio: () => void;
};

export const WordDetail = (props: WordDetailProps) => {
  return (
    <div>
      <div>{props.wordMeaning}</div>
      {props.sentences.map((sentence, index) => {
        return (
          <Sentence
            key={index}
            sentence={sentence.sentence}
            meaning={sentence.meaning}
            playAudio={props.playAudio}
          />
        );
      })}
    </div>
  );
};
