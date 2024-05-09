import React from "react";
import { StoryFn } from "@storybook/react";
import { WordDetail } from "./WordDetail";
import { WordDetailProps } from "./WordDetail";
export default {
  title: "WordBook/WordDetail",
  component: WordDetail,
};

const Template: StoryFn<WordDetailProps> = (args) => <WordDetail {...args} />;

export const Primary = Template.bind({});

Primary.args = {
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
