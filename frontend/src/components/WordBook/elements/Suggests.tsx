import React from "react";
import { styled } from "styled-components";

export type SuggestionsProps = {
  suggestions: string[];
  focusIndex: number;
  onClick: (suggestion: string) => void;
};

export const Suggestions = (props: SuggestionsProps) => {
  return (
    <SuggestionsContainer>
      {props.suggestions.map((suggestion, index) => (
        <SuggestionContainer
          key={index}
          focus={props.focusIndex === index}
          onClick={() => props.onClick(suggestion)}
        >
          {suggestion}
        </SuggestionContainer>
      ))}
    </SuggestionsContainer>
  );
};

const SuggestionsContainer = styled.div`
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #ffffff;
`;
const SuggestionContainer = styled.div<{ focus: boolean }>`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
  ${(props) => props.focus && "background-color: #f5f5f5;"}
`;
