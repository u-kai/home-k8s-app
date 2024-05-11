import React from "react";
import { StoryFn } from "@storybook/react";
import { WordBookBox } from "./WordBookBox";
import { WordBookBoxProps } from "./WordBookBox";
export default {
  title: "WordBook/WordBookBox",
  component: WordBookBox,
};

const Template: StoryFn<WordBookBoxProps> = (args) => <WordBookBox {...args} />;

export const Primary = Template.bind({});

const testProps = {
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

Primary.args = { wordbooks: Array(10).fill(testProps) };
