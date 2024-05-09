import React from "react";
import { styled } from "styled-components";
import { PlayAudioButton } from "./PlayAudioButton";

export type WordSummaryProps = {
  word: string;
  playAudio: () => void;
  handleRateChange: (rate: number) => Promise<void>;
  handleEdit: () => Promise<void>;
  handleDelete: () => Promise<void>;
};

export const WordSummary = (props: WordSummaryProps) => {
  return (
    <HorizontalContainer>
      <WordContainer>{props.word}</WordContainer>
      <PlayAudioButtonContainer>
        <PlayAudioButton onClick={props.playAudio}></PlayAudioButton>
      </PlayAudioButtonContainer>
    </HorizontalContainer>
  );
};

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const WordContainer = styled.div``;
const PlayAudioButtonContainer = styled.div``;
