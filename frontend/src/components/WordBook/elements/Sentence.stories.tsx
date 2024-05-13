import React from "react";
import { StoryFn } from "@storybook/react";
import { Sentence } from "./Sentence";
import { SentenceProps } from "./Sentence";
export default {
  title: "WordBook/Sentence",
  component: Sentence,
};

const Template: StoryFn<SentenceProps> = (args) => <Sentence {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  sentence: "This is a test sentence.",
  meaning: "これはテスト文です。",
};
