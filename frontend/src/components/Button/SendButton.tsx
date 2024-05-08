import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";

export type SendButtonProps = {
  width?: string;
  height?: string;
  text: string;
  handleClick: () => Promise<void>;
};

export const SendButton = (props: SendButtonProps) => {
  return (
    <Button
      variant="contained"
      endIcon={<SendIcon />}
      onClick={props.handleClick}
      sx={{
        width: props.width,
        height: props.height,
      }}
    >
      {props.text}
    </Button>
  );
};
