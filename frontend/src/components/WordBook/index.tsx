import React from "react";
import { AddButton } from "../Button/AddButton";
import { styled } from "styled-components";
import { SearchBarWithSuggest } from "./elements/SearchBarWithSuggest";
import { SortBox, TopOrBottom } from "./elements/SortBox";
import { WordBookBox } from "./elements/WordBookBox";
import { WordAccordionProps } from "./elements/Accordion";

export type WordBookProps = {};

export const WordBook = (props: WordBookProps) => {
  const wordbook: WordAccordionProps = {
    rate: 3,
    word: "apple",
    wordMeaning: "りんご",
    sentences: [
      {
        sentence: "This is an apple.",
        meaning: "これはりんごです。",
      },
      {
        sentence: "I like apple.",
        meaning: "私はりんごが好きです。",
      },
    ],
    playAudio: () => console.log("play audio"),
    handleDelete: async () => console.log("delete"),
    handleEdit: async () => console.log("edit"),
    handleRateChange: async (rate: number) => console.log(rate),
  };
  const wordbooks = Array(100).fill(wordbook);
  return (
    <Container>
      <SearchBarContainer>
        <SearchBarWithSuggest
          search={(word) => {
            console.log(word);
          }}
          allWords={["apple", "banana", "cherry"]}
          decideWord={(word) => {
            console.log(word);
          }}
        />
      </SearchBarContainer>
      <AddButtonContainer>
        <AddButton handler={() => console.log("add")} />
      </AddButtonContainer>
      <SortBoxContainer>
        <SortBox
          {...{
            Created: (tb: TopOrBottom) => console.log("Created"),
            Updated: (tb: TopOrBottom) => console.log("Updated"),
            Rate: (tb: TopOrBottom) => console.log("Rate"),
          }}
        />
      </SortBoxContainer>
      <WordBookContainer>
        <WordBookBox wordbooks={wordbooks} />
      </WordBookContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 25% 50% 5% 20%;
  grid-template-rows: 15% 10% 75%;
  width: 100%;
`;
const SearchBarContainer = styled.div`
  position: fixed;
  grid-column: 2/3;
  grid-row: 1/2;
  z-index: 100;
  width: 50%;
`;

const AddButtonContainer = styled.div`
  grid-column: 3/4;
  grid-row: 1/2;
  margin-top: 10px;
  margin-left: 30px;
  align-self: center;
`;

const WordBookContainer = styled.div`
  position: relative;
  grid-column: 1/5;
  grid-row: 3;
`;

const SortBoxContainer = styled.div`
  position: fixed;
  z-index: 100;
  grid-column: 4;
  grid-row: 2;
  left: 100%;
`;
