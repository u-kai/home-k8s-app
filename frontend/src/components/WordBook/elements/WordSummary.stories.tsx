import React from "react";
import { StoryFn } from "@storybook/react";
import { WordSummary } from "./WordSummary";
import { WordSummaryProps } from "./WordSummary";
export default {
  title: "Example/WordSummary",
  component: WordSummary,
};

const Template: StoryFn<WordSummaryProps> = (args) => <WordSummary {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  word: "test",
};
