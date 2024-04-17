import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

type Props = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  focused?: boolean;
};

export const MultilineText = (props: Props) => {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "40ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-multiline-static"
          label={props.label}
          multiline
          rows={9}
          placeholder={props.placeholder}
          focused={props.focused}
        />
      </div>
    </Box>
  );
};
