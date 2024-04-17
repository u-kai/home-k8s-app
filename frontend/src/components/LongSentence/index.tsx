import React from "react";
import { MultilineText } from "./elements/MultilineText";

export const LongSentenceBoxes = () => {
  return (
    <>
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
    </>
  );
};
