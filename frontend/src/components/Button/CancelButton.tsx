import { Button } from "@mui/material";
import React from "react";

export type CancelButtonProps = {
  width?: string;
  height?: string;
  text: string;
  handleClick: () => Promise<void>;
};

export const CancelButton = (props: CancelButtonProps) => {
  return (
    <Button
      color="error"
      variant="contained"
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
