import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

export type WordLineProps = {
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
      secondaryAction={<PlayCircleIcon onClick={() => speak(props.word)} />}
    >
      <ListItemText primary={props.word} />
    </ListItem>
  );
};
