import React from "react";
import { styled } from "styled-components";
import { WordProfile } from "../../../contexts/wordbook";

export type SuggestionsProps = {
  suggestions: WordProfile[];
  focusIndex: number;
  maxHeight?: string;
  onClick: (wordId: string) => void;
};

export const Suggestions = (props: SuggestionsProps) => {
  return (
    <SuggestionsContainer maxheight={props.maxHeight ?? "300px"}>
      {props.suggestions.map((suggestion, index) => (
        <SuggestionContainer
          key={index}
          focus={props.focusIndex === index}
          onClick={() => props.onClick(suggestion.wordId)}
        >
          {suggestion.word.value}
        </SuggestionContainer>
      ))}
    </SuggestionsContainer>
  );
};

const SuggestionsContainer = styled.div<{ maxheight: string }>`
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #ffffff;
  max-height: ${(props) => props.maxheight};
  overflow-y: scroll;
`;
const SuggestionContainer = styled.div<{ focus: boolean }>`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
  ${(props) => props.focus && "background-color: #f5f5f5;"}
`;
