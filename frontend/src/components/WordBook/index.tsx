import React from "react";
import { AddButton } from "../Button/AddButton";
import { styled } from "styled-components";
import { SearchBarWithSuggest } from "./elements/SearchBarWithSuggest";
import { SortBox, TopOrBottom } from "./elements/SortBox";
import { WordBookBox } from "./elements/WordBookBox";
import { WordAccordionProps } from "./elements/Accordion";

export type WordBookProps = {
  height?: string;
  onAddClick?: () => void;
  wordBooks: WordAccordionProps[];
  sort?: {
    [key: string]: (tb: TopOrBottom) => void;
  };
};

export const WordBook = (props: WordBookProps) => {
  const allWords = props.wordBooks.map((wordBook) => wordBook.word);
  return (
    <>
      <Container height={props.height ?? "100%"}>
        <SearchBarContainer>
          <SearchBarWithSuggest
            search={(word) => {
              console.log(word);
            }}
            allWords={allWords}
            decideWord={(word) => {
              console.log(word);
            }}
            maxHeight={"300px"}
          />
          <AddButtonContainer>
            <AddButton handler={() => props.onAddClick?.()} />
          </AddButtonContainer>
        </SearchBarContainer>
        <SortBoxContainer>
          <SortBox {...props.sort} />
        </SortBoxContainer>
        <WordBookContainer>
          <WordBookBox wordbooks={props.wordBooks} height={"100%"} />
        </WordBookContainer>
      </Container>
    </>
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
