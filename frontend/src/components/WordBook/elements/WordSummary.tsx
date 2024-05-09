import React from "react";
import { styled } from "styled-components";
import { PlayAudioButton } from "./PlayAudioButton";
import { Rates } from "./Rates";

export type WordSummaryProps = {
  word: string;
  rate: number;
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
      <RatesContainer>
        <Rates
          initRate={props.rate}
          onChange={async (rate: number) => props.handleRateChange(rate)}
        />
      </RatesContainer>
    </HorizontalContainer>
  );
};

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;
const RatesContainer = styled.div``;

const WordContainer = styled.div``;
const PlayAudioButtonContainer = styled.div``;
