import React from "react";
import { styled } from "styled-components";
import { SentenceProfile } from "../../../contexts/wordbook";
import { Sentence } from "./Sentence";

export type WordDetailProps = {
  wordMeaning: string;
  sentences: SentenceProfile[];
};

export const WordDetail = (props: WordDetailProps) => {
  return (
    <div>
      <div>{props.wordMeaning}</div>
      {props.sentences.map(({ sentence }, index) => {
        return (
          <SentenceContainer>
            <Sentence
              key={index}
              sentence={sentence.value}
              meaning={sentence.meaning}
            />
          </SentenceContainer>
        );
      })}
    </div>
  );
};

const SentenceContainer = styled.div`
  margin-top: 10px;
`;
