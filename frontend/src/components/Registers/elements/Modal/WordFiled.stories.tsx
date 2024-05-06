import React from "react";
import { StoryFn } from "@storybook/react";
import { WordField } from "./WordFiled";
import { WordFieldProps } from "./WordFiled";
export default {
  title: "Example/WordField",
  component: WordField,
};

const Template: StoryFn<WordFieldProps> = (args) => <WordField {...args} />;

export const Primary = Template.bind({});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
Primary.args = {
  width: "300px",
  word: {
    value: "test",
    meaning: "test",
    remarks: "test",
    pronunciation: "test",
  },
  translateHandler: async () => {
    await sleep(1000);
  },
};
