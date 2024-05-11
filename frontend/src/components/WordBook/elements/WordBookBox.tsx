import React from "react";
import { styled } from "styled-components";
import { WordAccordion, WordAccordionProps } from "./Accordion";

export type WordBookBoxProps = {
  wordbooks: WordAccordionProps[];
};

export const WordBookBox = (props: WordBookBoxProps) => {
  return (
    <Container>
      {props.wordbooks.map((props, index) => {
        return <WordAccordion key={index} {...props} />;
      })}
    </Container>
  );
};

const Container = styled.div``;
