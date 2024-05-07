import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";

export type AddButtonProps = {
  handler: () => void;
};

export const AddButton = (props: AddButtonProps) => {
  return (
    <Fab color="primary" aria-label="add" size="small">
      <AddIcon sx={{}} onClick={props.handler}></AddIcon>
    </Fab>
  );
};
