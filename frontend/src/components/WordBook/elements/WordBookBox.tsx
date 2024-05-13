import React from "react";
import { styled } from "styled-components";
import {
  DeleteWordProfile,
  UpdateWordProfile,
  useWordBook,
} from "../../../hooks/useWordBooks";
import { WordAccordion } from "./Accordion";

export type WordBookBoxProps = {
  height?: string;
  playAudio: () => void;
  updateWordProfile: UpdateWordProfile;
  deleteWordProfile: DeleteWordProfile;
};

export const WordBookBox = (props: WordBookBoxProps) => {
  const { wordbook } = useWordBook();
  const { playAudio, updateWordProfile, deleteWordProfile } = props;
  return (
    <Container height={props.height ?? "400px"}>
      {wordbook.map((props, index) => {
        return (
          <WordAccordion
            key={index}
            profile={props}
            playAudio={playAudio}
            updateWordProfile={updateWordProfile}
            deleteWordProfile={deleteWordProfile}
          />
        );
      })}
    </Container>
  );
};

const Container = styled.div<{ height: string }>`
  overflow-y: scroll;
  height: ${(props) => props.height};
`;
