import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Button } from "@mui/base";

export const RegisterButtons = () => {
  return (
    <Fab color="primary" aria-label="add" size="small">
      <AddIcon sx={{}}></AddIcon>
    </Fab>
  );
};
