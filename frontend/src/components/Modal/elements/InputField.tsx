import React from "react";
import { TextField } from "@mui/material";

export type InputFieldProps = {
  width?: string;
  value: string;
  handleWordChange: (word: string) => void;
  autoFocus?: boolean;
  required?: boolean;
  id?: string;
  label?: string;
  variant?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
};

export const InputField = (props: InputFieldProps) => {
  return (
    <TextField
      autoFocus={props.autoFocus}
      autoComplete="off"
      sx={{ width: props.width, marginTop: "3px" }}
      required={props.required}
      id={props.id}
      label={props.label}
      variant={props.variant ?? ("standard" as any)}
      value={props.value}
      onChange={(e) => props.handleWordChange(e.target.value)}
      onKeyDown={props.onKeyDown}
    />
  );
};
