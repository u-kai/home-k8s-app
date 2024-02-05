import { Button, ListItem, ListItemText } from "@mui/material";
import React from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Rates } from "./Rates";
import styled from "styled-components";

export type WordLineProps = {
  pronunciation?: string;
  word: string;
};

const speak = (word: string) => {
  const synth = window.speechSynthesis;
  const voice = synth.getVoices().filter((v) => v.lang === "en-US")[0];
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.voice = voice;
  synth.speak(utterance);
};
export const WordLine = (props: WordLineProps) => {
  return (
    <ListItem
      secondaryAction={
        <Button>
          <PlayCircleIcon onClick={() => speak(props.word)} />
        </Button>
      }
    >
      <VerticalContainer>
        <Pronunciation>{props.pronunciation}</Pronunciation>
        <Word>{props.word}</Word>
      </VerticalContainer>
    </ListItem>
  );
};

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 10px;
  width: 100%;
`;

const Pronunciation = styled.div`
  font-size: 0.8em;
  color: #666;
  margin-left: 10px;
`;

const Word = styled.div`
  font-size: 1.3em;
  width: 300px;
  overflow: hidden;
`;
