import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";

type ButtonProps = {
  handler: () => void;
};

export const RegisterButtons = (props: ButtonProps) => {
  return (
    <Fab color="primary" aria-label="add" size="small">
      <AddIcon sx={{}} onClick={props.handler}></AddIcon>
    </Fab>
  );
};
