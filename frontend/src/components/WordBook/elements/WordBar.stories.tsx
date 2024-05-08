import React from "react";
import { StoryFn } from "@storybook/react";
import { WordBar } from "./WordBar";
import { WordBarProps } from "./WordBar";
export default {
  title: "Example/WordBar",
  component: WordBar,
};

const Template: StoryFn<WordBarProps> = (args) => <WordBar {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  word: "test",
};
