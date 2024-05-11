import React from "react";
import { AddButton } from "../Button/AddButton";
import { styled } from "styled-components";
import { SearchBarWithSuggest } from "./elements/SearchBarWithSuggest";
import { SortBox, TopOrBottom } from "./elements/SortBox";
import { WordBookBox } from "./elements/WordBookBox";
import { WordAccordionProps } from "./elements/Accordion";

export type WordBookProps = {
  height?: string;
};

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
    <Container height={props.height ?? "100%"}>
      <SearchBarContainer>
        <SearchBarWithSuggest
          search={(word) => {
            console.log(word);
          }}
          allWords={Array(100).fill("apple") as string[]}
          decideWord={(word) => {
            console.log(word);
          }}
          maxHeight={"300px"}
        />
        <AddButtonContainer>
          <AddButton handler={() => console.log("add")} />
        </AddButtonContainer>
      </SearchBarContainer>
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
        <WordBookBox wordbooks={wordbooks} height={"100%"} />
      </WordBookContainer>
    </Container>
  );
};

const Container = styled.div<{ height: string }>`
  display: grid;
  grid-template-columns: 25% 50% 5% 20%;
  grid-template-rows: 10% 8% 82%;
  width: 100%;
  height: ${(props) => props.height};
`;
const SearchBarContainer = styled.div`
  position: relative;
  z-index: 100;
  grid-column: 2;
  display: flex;
  direction: row;
`;

const AddButtonContainer = styled.div`
  margin-left: 10px;
  margin-top: 20px;
`;

const WordBookContainer = styled.div`
  position: relative;
  grid-column: 1/5;
  grid-row: 3;
`;

const SortBoxContainer = styled.div`
  grid-column: 4;
  grid-row: 2;
  left: 100%;
`;
