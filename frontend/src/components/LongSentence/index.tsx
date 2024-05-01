import React from "react";
import { MultilineText } from "./elements/MultilineText";
import styled from "styled-components";

export const LongSentenceBoxes = () => {
  return (
    <HorizontalContainer>
      <MultilineText
        value="value"
        onChange={(event) => console.log(event)}
        label="English"
        placeholder="Enter a long sentence in English"
      />
      <MultilineText
        value="value"
        onChange={(event) => console.log(event)}
        label="Result of translation"
        placeholder=""
      />
    </HorizontalContainer>
  );
};

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
