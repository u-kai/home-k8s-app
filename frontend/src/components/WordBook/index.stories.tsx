import React from "react";
import { StoryFn } from "@storybook/react";
import { WordBook } from "./index";
import { WordBookProps } from "./index";
import { WordAccordionProps } from "./elements/Accordion";
export default {
  title: "WordBook/WordBook",
  component: WordBook,
};

const Template: StoryFn<WordBookProps> = (args) => <WordBook {...args} />;

export const Primary = Template.bind({});

const testWord: WordAccordionProps = {
  word: "test",
  wordMeaning: "testMeaning",
  sentences: [
    {
      sentence: "this is a test sentence",
      meaning: "これはテストの文です",
    },
    {
      sentence: "this is a test sentence",
      meaning: "これはテストの文です",
    },
  ],
  rate: 3,
  handleDelete: async () => {},
  handleEdit: async () => {},
  handleRateChange: async (rate: number) => {},
  playAudio: async () => {},
};

const tests = Array(100).fill(testWord);
Primary.args = {
  height: "400px",
  wordBooks: tests,
};
