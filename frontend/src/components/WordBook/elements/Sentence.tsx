import React from "react";
import { styled } from "styled-components";
import { PlayAudioButton } from "./PlayAudioButton";

export type SentenceProps = {
  sentence: string;
  meaning: string;
  playAudio: (sentence: string) => void;
};

export const Sentence = (props: SentenceProps) => {
  return (
    <HorizontalContainer>
      <SentenceContainer>
        <div>{props.sentence}</div>
        <div>{props.meaning}</div>
      </SentenceContainer>
      <ButtonContainer>
        <PlayAudioButton onClick={() => props.playAudio(props.sentence)} />
      </ButtonContainer>
    </HorizontalContainer>
  );
};

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const ButtonContainer = styled.div``;

const SentenceContainer = styled.div`
  position: relative;
  margin-left: 10px;
  width: 100%;
  height: 100%;
`;
