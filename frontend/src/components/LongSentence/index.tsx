import React, { useContext, useState } from "react";
import styled from "styled-components";
import { SpanInput } from "./elements/SpanInput";
import { ReadOnlyInput } from "./elements/ReadOnlyInput";
import { UserContext } from "../../contexts/user";
import { LongSentenceTranslate } from "./elements";
import { translateSentence } from "../../clients/translate";

export type LongSentenceTranslateComponentProps = {
  handleWordClick: (word: string) => Promise<void>;
  height?: string;
};

export const LongSentenceTranslateComponent = (
  props: LongSentenceTranslateComponentProps
) => {
  const { user } = useContext(UserContext);
  return (
    <LongSentenceTranslate
      handleWordClick={props.handleWordClick}
      sseTranslateSentence={async (sentence, f) => {
        await translateSentence(
          {
            sentence: sentence,
            sseHandler: f,
            toLang: "ja",
          },
          user.token ?? ""
        );
      }}
      height={props.height}
    />
  );
};
