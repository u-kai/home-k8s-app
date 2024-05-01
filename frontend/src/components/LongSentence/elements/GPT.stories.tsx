import React from "react";
import { StoryFn } from "@storybook/react";
import { WordProcessor } from "./GPT";

export default {
  title: "Example/WordProcessor",
  component: WordProcessor,
};

const Template: StoryFn<{
  border?: string;
  height?: string;
  width?: string;
}> = (args) => <WordProcessor {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
