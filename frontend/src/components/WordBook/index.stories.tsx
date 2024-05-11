import React from "react";
import { StoryFn } from "@storybook/react";
import { WordBook } from "./index";
import { WordBookProps } from "./index";
export default {
  title: "WordBook/WordBook",
  component: WordBook,
};

const Template: StoryFn<WordBookProps> = (args) => <WordBook {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
