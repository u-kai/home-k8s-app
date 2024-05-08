import React from "react";
import { StoryFn } from "@storybook/react";
import { LongSentenceTranslate } from "./index";
import { LongSentenceTranslateProps } from "./index";
import { styled } from "styled-components";
export default {
  title: "Example/LongSentenceTranslate",
  component: LongSentenceTranslate,
};

const Template: StoryFn<LongSentenceTranslateProps> = (args) => (
  <Container>
    <LongSentenceTranslate {...args} />
  </Container>
);

export const Primary = Template.bind({});

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -10;
`;

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

const sseTranslateSentence = async (
  sentence: string,
  f: (chunk: string) => void
) => {
  console.log(sentence);
  for (const word of sentence.split("")) {
    await sleep(100);
    f(word);
  }
};

Primary.args = {
  handleWordClick: async (word: string) => {
    console.log(word);
  },
  sseTranslateSentence: sseTranslateSentence,
};
