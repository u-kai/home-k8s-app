import { Button, ListItem } from "@mui/material";
import React from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import styled from "styled-components";
import { speak } from "../../../../fetch";

export type WordLineProps = {
  pronunciation?: string;
  word: string;
  wordSize?: string;
};

export const WordLine = (props: WordLineProps) => {
  return (
    <ListItem
      secondaryAction={
        <Button>
          <PlayCircleIcon onClick={() => speak(props.word)} />
        </Button>
      }
      sx={{ height: 50, zIndex: 1, width: "100%" }}
    >
      <VerticalContainer>
        <Pronunciation>{props.pronunciation}</Pronunciation>
        <Word fontSize={props.wordSize ?? "0.8rem"}>{props.word}</Word>
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
  width: 50%;
  white-space: nowrap;
`;
