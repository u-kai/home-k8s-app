import React from "react";
import { StoryFn } from "@storybook/react";
import { LongSentenceTranslate } from "./index";
import { LongSentenceTranslateProps } from "./index";
export default {
  title: "Example/LongSentenceTranslate",
  component: LongSentenceTranslate,
};

const Template: StoryFn<LongSentenceTranslateProps> = (args) => (
  <LongSentenceTranslate {...args} />
);

export const Primary = Template.bind({});

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
