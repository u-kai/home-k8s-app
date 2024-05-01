import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import styled from "styled-components";

type Props = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  label: string;
  placeholder: string;
  focused?: boolean;
};

export const MultilineText = (props: Props) => {
  //const splitWord = props.value.split(" ");
  //console.log(splitWord);
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
          rows={5}
          placeholder={props.placeholder}
          focused={props.focused}
          onChange={props.onChange}
          value={props.value}
        />
      </div>
    </Box>
  );
};

//{/* <TextBox>
//  <TextField
//    id="outlined-multiline-static"
//    label={props.label}
//    multiline
//    rows={5}
//    onKeyDown={props.onKeyDown}
//    placeholder={props.placeholder}
//    focused={props.focused}
//    onChange={props.onChange}
//    value={""}
//  />
//  {splitWord.map((word, index) => (
//    <span key={index} onClick={() => console.log(word)}>
//      {word}
//    </span>
//  ))}
//</TextBox> */}
const TextBox = styled.div`
  width: 40ch;
  height: 5em;
  border: 1px solid #000;
`;
