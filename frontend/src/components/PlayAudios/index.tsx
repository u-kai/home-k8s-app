import React, { useEffect } from "react";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useWordBook } from "../../hooks/useWordBooks";
import { speak } from "../../clients/fetch";
export const PlayAudios = () => {
  const [audioIndex, setAudioIndex] = React.useState(0);
  const [doPlay, setDoPlay] = React.useState(false);
  const { wordbook } = useWordBook();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (doPlay) {
        if (audioIndex === wordbook.length - 1) {
          setDoPlay(false);
          setAudioIndex(0);
          return;
        }
        setAudioIndex((v) => (v + 1) % wordbook.length);
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (doPlay) {
      speak(wordbook[audioIndex].word.value);
    }
  }, [audioIndex, doPlay]);

  return (
    <>
      <FastRewindIcon
        fontSize="large"
        sx={{
          cursor: "pointer",
        }}
        onClick={() => {
          setAudioIndex((v) => (v - 1 + wordbook.length) % wordbook.length);
          setDoPlay(true);
        }}
      />
      <PlayArrowIcon
        fontSize="large"
        sx={{
          cursor: "pointer",
        }}
        onClick={() => setDoPlay((v) => !v)}
      />

      <FastForwardIcon
        fontSize="large"
        sx={{
          cursor: "pointer",
        }}
        onClick={() => {
          setAudioIndex((v) => (v + 1) % wordbook.length);
          setDoPlay(true);
        }}
      />
    </>
  );
};
