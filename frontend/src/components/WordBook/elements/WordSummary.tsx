import React from "react";
import { styled } from "styled-components";
import { DeleteIcon } from "./DeleteIcon";
import { EditIcon } from "./EditIcon";
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
      <EditIconContainer>
        <EditIcon handleEdit={props.handleEdit} />
      </EditIconContainer>
      <DeleteIconContainer>
        <DeleteIcon handleDelete={props.handleDelete} />
      </DeleteIconContainer>
    </HorizontalContainer>
  );
};

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
`;

const WordContainer = styled.div`
  font-size: 20px;
  overflow: hidden;
  width: 55%;
  @media (max-width: 960px) {
    width: 40%;
  }
  @media (max-width: 800px) {
    width: 30%;
  }
  @media (max-width: 520px) {
    width: 50%;
    font-size: 14px;
  }
`;
const PlayAudioButtonContainer = styled.div``;
const RatesContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: center;
  @media (max-width: 520px) {
    display: none;
  }
`;
const EditIconContainer = styled.div``;
const DeleteIconContainer = styled.div``;
