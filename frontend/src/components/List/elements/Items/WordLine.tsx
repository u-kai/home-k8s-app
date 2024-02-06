import { Button, ListItem, ListItemText } from "@mui/material";
import React from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Rates } from "./Rates";
import styled from "styled-components";

export type WordLineProps = {
  pronunciation?: string;
  word: string;
  wordSize?: WordSize;
};
type WordSize = "small" | "medium" | "large";

const speak = (word: string) => {
  const synth = window.speechSynthesis;
  const voice = synth.getVoices().filter((v) => v.lang === "en-US")[0];
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.voice = voice;
  synth.speak(utterance);
};
const wordSize = (size: WordSize): string => {
  switch (size) {
    case "small":
      return "0.8em";
    case "medium":
      return "1.3em";
    case "large":
      return "1.8em";
  }
};
export const WordLine = (props: WordLineProps) => {
  return (
    <ListItem
      secondaryAction={
        <Button sx={{ zIndex: 2 }}>
          <PlayCircleIcon onClick={() => speak(props.word)} />
        </Button>
      }
      sx={{ height: 80, zIndex: 1, width: "100%" }}
    >
      <VerticalContainer>
        <Pronunciation>{props.pronunciation}</Pronunciation>
        <Word fontSize={wordSize(props.wordSize ?? "medium")}>
          {props.word}
        </Word>
      </VerticalContainer>
    </ListItem>
  );
};

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 1px;
  width: 100%;
  overflow: hidden;
`;

const Pronunciation = styled.div`
  font-size: 0.8em;
  color: #666;
  margin-left: 10px;
`;

const Word = styled.div<{ fontSize: string }>`
  font-size: ${(props) => props.fontSize};
  width: 80%;
  white-space: nowrap;
`;
