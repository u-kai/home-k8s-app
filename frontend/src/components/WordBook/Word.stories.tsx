import React from "react";
import { StoryFn } from "@storybook/react";
import { Word } from "./Word";
import { WordProps } from "./Word";
export default {
  title: "Example/Word",
  component: Word,
};

const Template: StoryFn<WordProps> = (args) => <Word {...args} />;

export const Primary = Template.bind({});

Primary.args = { word: "Hello" };
