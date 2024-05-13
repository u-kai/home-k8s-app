import React, { useContext } from "react";
import { AddButton } from "../Button/AddButton";
import { styled } from "styled-components";
import { SearchBarWithSuggest } from "./elements/SearchBarWithSuggest";
import { SortBox } from "./elements/SortBox";
import { WordBookBox } from "./elements/WordBookBox";
import {
  DeleteWordProfile,
  UpdateWordProfile,
  useWordBook,
} from "../../hooks/useWordBooks";
import { ModalContext } from "../../contexts/modalWord";

export type WordBookProps = {
  height?: string;
  updateWordProfile: UpdateWordProfile;
  deleteWordProfile: DeleteWordProfile;
};

export const WordBook = (props: WordBookProps) => {
  const { sortByWord, sortByCreatedAt, sortByLikeRates, sortByUpdatedAt } =
    useWordBook();
  const { modalWordDispatch } = useContext(ModalContext);
  return (
    <>
      <Container height={props.height ?? "100%"}>
        <SearchBarContainer>
          <SearchBarWithSuggest maxHeight={"300px"} />
          <AddButtonContainer>
            <AddButton
              handler={() =>
                modalWordDispatch({
                  type: "open",
                })
              }
            />
          </AddButtonContainer>
        </SearchBarContainer>
        <SortBoxContainer>
          <SortBox
            {...{
              Word: (tp) => sortByWord(tp),
              Like: (tp) => sortByLikeRates(tp),
              CreatedAt: (tp) => sortByCreatedAt(tp),
              UpdatedAt: (tp) => sortByUpdatedAt(tp),
            }}
          />
        </SortBoxContainer>
        <WordBookContainer>
          <WordBookBox height={"100%"} {...props} />
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
