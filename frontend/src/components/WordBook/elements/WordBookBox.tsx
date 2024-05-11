import React from "react";
import { styled } from "styled-components";
import { WordAccordion, WordAccordionProps } from "./Accordion";

export type WordBookBoxProps = {
  height?: string;
  wordbooks: WordAccordionProps[];
};

export const WordBookBox = (props: WordBookBoxProps) => {
  return (
    <Container height={props.height ?? "400px"}>
      {props.wordbooks.map((props, index) => {
        return <WordAccordion key={index} {...props} />;
      })}
    </Container>
  );
};

const Container = styled.div<{ height: string }>`
  overflow-y: scroll;
  height: ${(props) => props.height};
`;
