import React from "react";
import { styled } from "styled-components";
import { SearchBar } from "./SearchBar";
import { Suggestions } from "./Suggests";

export type SearchBarWithSuggestProps = {
  search: (word: string) => void;
  allWords: string[];
  decideWord: (word: string) => void;
  maxHeight?: string;
};

const getSuggestions = (all: string[], search: string): string[] => {
  if (search === "") {
    return [];
  }
  const words = all.filter((word) => {
    return word.includes(search);
  });
  const sortFn = (search: string, a: string, b: string) => {
    return a.indexOf(search) - b.indexOf(search);
  };
  return words.sort((a, b) => sortFn(search, a, b));
};

export const SearchBarWithSuggest = (props: SearchBarWithSuggestProps) => {
  const [searchedValue, setSearchedValue] = React.useState<string>("");
  const [focusIndex, setFocusIndex] = React.useState<number>(-1);
  const reset = () => {
    setFocusIndex(-1);
    setSearchedValue("");
  };
  const keyDown = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "ArrowDown") {
      setFocusIndex(
        (prev) =>
          (prev + 1) % getSuggestions(props.allWords, searchedValue).length
      );
    } else if (e.key === "ArrowUp") {
      setFocusIndex(
        (prev) =>
          (prev - 1 + getSuggestions(props.allWords, searchedValue).length) %
          getSuggestions(props.allWords, searchedValue).length
      );
    }
    if (e.key === "Enter") {
      props.decideWord(
        getSuggestions(props.allWords, searchedValue)[focusIndex]
      );
      reset();
    }
  };
  return (
    <Container>
      <SearchBar
        search={props.search}
        keyDown={keyDown}
        value={searchedValue}
        onChange={(v) => setSearchedValue(v)}
      />
      <SuggestionsContainer>
        <Suggestions
          focusIndex={focusIndex}
          onClick={props.decideWord}
          suggestions={getSuggestions(props.allWords, searchedValue)}
          maxHeight={props.maxHeight}
        />
      </SuggestionsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SuggestionsContainer = styled.div`
  margin-top: 15px;
`;
