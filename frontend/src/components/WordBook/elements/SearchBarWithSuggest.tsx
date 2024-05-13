import React from "react";
import { styled } from "styled-components";
import { WordProfile } from "../../../contexts/wordbook";
import { useWordBook } from "../../../hooks/useWordBooks";
import { SearchBar } from "./SearchBar";
import { Suggestions } from "./Suggests";

export type SearchBarWithSuggestProps = {
  maxHeight?: string;
};

const getSuggestions = (all: WordProfile[], search: string): WordProfile[] => {
  if (search === "") {
    return [];
  }
  const words = all.filter((word) => {
    return word.word.value.includes(search);
  });
  const sortFn = (search: string, a: WordProfile, b: WordProfile) => {
    return a.word.value.indexOf(search) - b.word.value.indexOf(search);
  };
  return words.sort((a, b) => sortFn(search, a, b));
};

export const SearchBarWithSuggest = (props: SearchBarWithSuggestProps) => {
  const [searchedValue, setSearchedValue] = React.useState<string>("");
  const [focusIndex, setFocusIndex] = React.useState<number>(-1);
  const { wordbook, wordToTop } = useWordBook();
  const reset = () => {
    setFocusIndex(-1);
    setSearchedValue("");
  };
  const keyDown = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "ArrowDown") {
      setFocusIndex(
        (prev) => (prev + 1) % getSuggestions(wordbook, searchedValue).length
      );
    } else if (e.key === "ArrowUp") {
      setFocusIndex(
        (prev) =>
          (prev - 1 + getSuggestions(wordbook, searchedValue).length) %
          getSuggestions(wordbook, searchedValue).length
      );
    }
    if (e.key === "Enter") {
      wordToTop(getSuggestions(wordbook, searchedValue)[focusIndex].wordId);
      reset();
    }
  };
  return (
    <Container>
      <SearchBar
        // TODO
        search={() => {}}
        keyDown={keyDown}
        value={searchedValue}
        onChange={(v) => setSearchedValue(v)}
      />
      <SuggestionsContainer>
        <Suggestions
          focusIndex={focusIndex}
          suggestions={getSuggestions(wordbook, searchedValue)}
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
