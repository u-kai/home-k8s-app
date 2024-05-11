import React from "react";
import { StoryFn } from "@storybook/react";
import { WordAccordion, WordAccordionProps } from "./Accordion";
export default {
  title: "WordBook/WordAccordion",
  component: WordAccordion,
};

const Template: StoryFn<WordAccordionProps> = (args) => (
  <WordAccordion {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  word: "test",
  playAudio: () => {
    console.log("play audio");
  },
  rate: 3,
  handleDelete: async () => console.log("delete"),
  handleEdit: async () => console.log("edit"),
  handleRateChange: async (rate: number) => console.log(rate),
  wordMeaning: "テスト",
  sentences: [
    {
      sentence: "This is a test sentence.",
      meaning: "これはテスト文です。",
    },
    {
      sentence: "This is another test sentence.",
      meaning: "これは別のテスト文です。",
    },
  ],
};
