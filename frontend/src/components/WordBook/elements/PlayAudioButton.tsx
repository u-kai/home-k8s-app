import React from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Button } from "@mui/material";

export type PlayAudioButtonProps = {
  onClick: () => void;
};
export const PlayAudioButton = (props: PlayAudioButtonProps) => {
  return (
    <Button>
      <PlayCircleIcon onClick={() => props.onClick()} />
    </Button>
  );
};
