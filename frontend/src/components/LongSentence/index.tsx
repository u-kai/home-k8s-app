import React, { useContext, useState } from "react";
import { MultilineText } from "./elements/MultilineText";
import styled from "styled-components";
import { Button } from "@mui/material";
import { translateSentence } from "../../clients/translate";
import { UserContext } from "../../contexts/user";

export const LongSentenceBoxes = () => {
  const [value, setValue] = useState("");
  const [englishFocused, setEnglishFocused] = useState(false);
  const [resultFocused, setResultFocused] = useState(false);
  const [result, setResult] = useState("");
  const { user } = useContext(UserContext);
  const handler = async () => {
    setResult("");
    translateSentence(
      {
        sentence: value,
        sseHandler: (data) => setResult((prev) => prev + data),
        toLang: "ja",
      },
      user.token ?? ""
    );
  };
  return (
    <HorizontalContainer>
      <MultilineText
        value={value}
        focused={englishFocused}
        onChange={(event) => setValue(event.target.value)}
        label="English"
        placeholder="Enter a long sentence in English"
      />
      <MultilineText
        value={result}
        onChange={(event) => setResult(event.target.value)}
        label="Result of translation"
        focused={resultFocused}
        placeholder=""
      />
      <Button
        sx={{ mt: 10, ml: 2, width: 50, height: 40 }}
        variant="contained"
        color="primary"
        onClick={() => handler()}
      >
        Send
      </Button>
    </HorizontalContainer>
  );
};

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
